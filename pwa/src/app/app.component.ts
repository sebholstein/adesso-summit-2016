import { Observable } from 'rxjs/Observable';
import { DeepstreamService } from './deepstream.service';
import { Component } from '@angular/core';

@Component({
  selector: 'pwa-root',
  template: `
<md-toolbar color="primary" class="toolbar">
  <span>SummIT PWA</span>
  <span class="fill-remaining-space"></span>
  <span class="connection-state">
    <span *ngIf="(connectionState$ | async) === 'OPEN'">👍🏼</span>
    <span *ngIf="(connectionState$ | async) !== 'OPEN'">👎</span>
  </span>
</md-toolbar>

<md-spinner *shellRender></md-spinner>

<div class="app-content">
  <router-outlet>
  </router-outlet>
</div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pwa works!';
  connectionState$: Observable<string>;

  constructor(d: DeepstreamService) {
    this.connectionState$ = d.connectionState$;
    if (d.hasDeepstreamUsername()) {
      d.connect();
    }
  }
}
