import { element } from 'protractor';
import { WebAudioDialogComponent } from './web-audio-dialog/web-audio-dialog.component';
import { SpeechDialogComponent } from './speech-dialog/speech-dialog.component';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef } from '@angular/material';

@Injectable()
export class DeepstreamService {
  client: any;
  username: string;
  private _connectionState$: BehaviorSubject<string> = new BehaviorSubject('CLOSED')
  private _onConnect$: Observable<any> = new Observable();
  speechDialogRef: MdDialogRef<SpeechDialogComponent>;
  webAudioDialogRef: MdDialogRef<WebAudioDialogComponent>;

  constructor(private _zone: NgZone, public dialog: MdDialog) { 
    this.username = window.localStorage.getItem('deepstream_username') || '';
  }

  hasDeepstreamUsername(): boolean {
    return this.username != null && this.username.length > 0; 
  }

  connect(username: string = ''): Promise<any> {
    if (username != null && username.length > 0 && username !== this.username) {
      this.username = username;
    }
    window.localStorage.setItem('deepstream_username', this.username);
    this.client = deepstream(`${window.location.hostname}:6020`);
    const creds = {username: this.username, password: '1234'};
    return new Promise((resolve) => {
      this.client.login(creds, () => {
        resolve(this.client);
        this._trackConnectionState();
        this._publishBrowserDetails();
        this._laughListener();
        if ('vibrate' in navigator) {
          this._vibrateListener();
        }
        if ('DeviceOrientationEvent' in window) {
          this._deviceOrientationListener();
        }
        if ('SpeechSynthesisUtterance' in window) {
          this._speechSynthesisUtteranceListener();
        }
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
          this._webAudioListener();
        }
      });
    })
  }

  private _trackConnectionState() {
    this._connectionState$.next(this.client.getConnectionState());
    this.client.on('connectionStateChanged', (state: string) => {
      this._zone.run(() => this._connectionState$.next(state));
    })
  }

  private _publishBrowserDetails() {
    this.client.record.getRecord(`browserDetails/${this.username}`).whenReady((record) => {
      record.set({
        serviceWorker: 'serviceWorker' in navigator,
        vibrate: 'vibrate' in navigator,
        deviceOrientation: 'DeviceOrientationEvent' in window,
        speechSynthesis: 'SpeechSynthesisUtterance' in window,
        webAudio: 'AudioContext' in window || 'webkitAudioContext' in window
      });
    })
  }

  get connectionState$ () {
    return this._connectionState$.asObservable();
  } 

  private _speechSynthesisUtteranceListener() {
    this.client.event.subscribe(`command/speak`, (data) => {
      if (this.speechDialogRef != null) {
        this.speechDialogRef.close();
      }
      (<any>window).speakMessage = data;

      this.speechDialogRef = this.dialog.open(SpeechDialogComponent, {
        disableClose: false
      });
    });
  }

  private _webAudioListener() {
    this.client.event.subscribe(`command/webAudio`, (data) => {
      if (this.webAudioDialogRef != null) {
        this.webAudioDialogRef.close();
      }
      (<any>window).speakMessage = data;

      this.webAudioDialogRef = this.dialog.open(WebAudioDialogComponent, {
        disableClose: false
      });
    });
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
    this.client.event.subscribe(`command/startDeviceOrientation`, (data) => {
      this.client.record.getRecord(`deviceOrientation/${this.username}`).whenReady(record => {
        this.client.record.getList('deviceOrientations').whenReady(list => {
          if (list.getEntries().indexOf(this.username) === -1) {
            list.addEntry(`deviceOrientation/${this.username}`);
          }
          let a = false;
          s = Observable.fromEvent<DeviceOrientationEvent>(window, 'deviceorientation')
            .throttleTime(350)
            .skipWhile((e) => e == null || e.alpha == null)
            .distinctUntilChanged()
            .subscribe((e) => {
              record.set({
                alpha: e.alpha,
                beta: e.beta,
                gamma: e.gamma
              });
            });
        });
      })
    });


    this.client.event.subscribe(`command/stopDeviceOrientation`, () => {
      if (s != null) {
        s.unsubscribe();
        s = null;
      }
    });
  }

  _vibrateListener() {
    this.client.event.subscribe(`command/vibrate`, (time) => {
      navigator.vibrate(time != null ? time : 1000);
    });
  }
}
