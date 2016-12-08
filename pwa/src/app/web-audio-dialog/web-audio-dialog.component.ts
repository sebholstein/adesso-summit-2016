import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-web-audio-dialog',
  templateUrl: './web-audio-dialog.component.html',
  styleUrls: ['./web-audio-dialog.component.css']
})
export class WebAudioDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  playSound() {
    let ctx;
    if ((<any>window).AudioContext != null) {
      ctx = new (<any>window).AudioContext();
    } else {
      ctx = new (<any>window).webkitAudioContext();
    }
    let oscillator = ctx.createOscillator();
    let gainNode = ctx.createGain();

    gainNode.connect(ctx.destination);
    oscillator.connect(gainNode);
    oscillator.frequency.value = 523.25; // C5

    let oscillator2 = ctx.createOscillator();
    oscillator2.connect(gainNode);
    oscillator2.frequency.value = 659.25; // E5

    let oscillator3 = ctx.createOscillator();
    oscillator3.connect(gainNode);
    oscillator3.frequency.value = 783.99; // G5

    oscillator.start(0);
    oscillator2.start(0);
    oscillator3.start(0);
    setTimeout(() => {
      oscillator.stop();
      oscillator2.stop();
      oscillator3.stop();
    }, 1500);
  }

}
