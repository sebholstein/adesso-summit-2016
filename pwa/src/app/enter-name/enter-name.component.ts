import { DeepstreamService } from './../deepstream.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdInput } from '@angular/material';

@Component({
  selector: 'pwa-enter-name',
  styles: [`
    .app-input-section md-input {
      width: 100%
    }
    
    .save-button {
      margin-top: 20px;
    }`],
  templateUrl: './enter-name.component.html'
})
export class EnterNameComponent implements AfterViewInit {
  @ViewChild('fullName') nameInput: MdInput;

  constructor(private _router: Router, private _ds: DeepstreamService) { 
  }

  login($event: Event) {
    $event.preventDefault();
    const username = this.nameInput.value;
    if (username == null || username.trim().length < 4 || username.trim().length > 40) {
      return;
    }
    this._ds.connect(username.trim());
    this._router.navigate(['/schedule'], {replaceUrl: true});
  }

  ngAfterViewInit() {
    if (this._ds.hasDeepstreamUsername()) {
      this._ds.connect();
      this._router.navigate(['/schedule'], {replaceUrl: true});
      return;
    }
  }

}
