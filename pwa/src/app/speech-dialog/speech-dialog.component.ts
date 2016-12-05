import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'pwa-speech-dialog',
  templateUrl: './speech-dialog.component.html',
  styleUrls: ['./speech-dialog.component.css']
})
export class SpeechDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<SpeechDialogComponent>) { }

  ngOnInit() {
  }

  speak() {
    if ((<any>window).speakMessage != null) {
      var msg = new (<any>window).SpeechSynthesisUtterance();
      msg.voiceURI = 'native';
      msg.volume = 1; // 0 to 1
      msg.rate = (<any>window).speakMessage.rate || 1; // 0.1 to 10
      msg.pitch = (<any>window).speakMessage.pitch || 1; //0 to 2
      msg.text = (<any>window).speakMessage.text;
      msg.lang = 'de-DE';
      
      this.dialogRef.close();
      (<any>window).speechSynthesis.speak(msg);
      (<any>window).speakMessage = null;
    }
    
  }

}
