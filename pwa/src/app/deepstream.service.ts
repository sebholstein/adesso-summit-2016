import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DeepstreamService {
  client: any;
  username: string;
  private _connectionState$: BehaviorSubject<string> = new BehaviorSubject('CLOSED')

  constructor(private _zone: NgZone) { 
    this.username = window.localStorage.getItem('deepstream_username') || '';
  }

  hasDeepstreamUsername(): boolean {
    return this.username != null && this.username.length > 0; 
  }

  connect(username: string = '') {
    if (username != null && username.length > 0 && username !== this.username) {
      this.username = username;
    }
    window.localStorage.setItem('deepstream_username', this.username);
    this.client = deepstream(`${window.location.hostname}:6020`);
    const creds = {username: this.username, password: '1234'};
    this.client.login(creds, () => {
      this._trackConnectionState();
      this._publishBrowserDetails();
      this._laughListener();
      if ('vibrate' in navigator) {
        this._vibrateListener();
      }
      if ('DeviceOrientationEvent' in window) {
        this._deviceOrientationListener();
      }
    });
  }

  private _trackConnectionState() {
    this._connectionState$.next(this.client.getConnectionState());
    this.client.on('connectionStateChanged', (state: string) => {
      this._zone.run(() => this._connectionState$.next(state));
    })
  }

  get connectionState$(): Observable<string> {
    return this._connectionState$.asObservable().distinctUntilChanged();
  }

  private _publishBrowserDetails() {
    this.client.record.getRecord(`browserDetails/${this.username}`).whenReady((record) => {
      record.set({
        serviceWorker: 'serviceWorker' in navigator,
        vibrate: 'vibrate' in navigator,
        deviceOrientation: 'DeviceOrientationEvent' in window
      });
    })
  }

  private _laughListener() {
    var audio = document.createElement('audio');
    audio.src = 'assets/laugh.mp3';
    audio.preload = 'auto';
    audio.volume = 1;

    this.client.event.subscribe(`command/laugh/${this.username}`, () => {
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 2000);
    });
  }

  private _deviceOrientationListener() {
    let s: Subscription;
    this.client.event.subscribe(`command/startDeviceOrientation`, () => {
      this.client.record.getRecord(`deviceOrientation/${this.username}`).whenReady(record => {
        s = Observable.fromEvent<Event>(window, 'deviceorientation').debounceTime(100).subscribe();
      })
    });

    this.client.record.subscribe(`command/startDeviceOrientation`, () => {
      if (s != null) {
        s.unsubscribe();
      }
    });
  }

  _vibrateListener() {
    this.client.event.subscribe(`command/vibrate`, (time) => {
      navigator.vibrate(time != null ? time : 1000);
    });
  }
}
