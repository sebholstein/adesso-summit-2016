import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-web-audio-dialog',
  templateUrl: './web-audio-dialog.component.html',
  styleUrls: ['./web-audio-dialog.component.css']
})
export class WebAudioDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let ctx;
    if ((<any>window).AudioContext != null) {
      ctx = new (<any>window).AudioContext();
    } else {
      ctx = new (<any>window).webkitAudioContext();
    }
    let oscillator = ctx.createOscillator();
    let gainNode = ctx.createGain();

    oscillator.type = 'square';

    gainNode.connect(ctx.destination);
    oscillator.connect(gainNode);

    oscillator.start(0);
    setTimeout(() => {
      oscillator.stop();
    }, 1500);
  }

}
