import { Observable } from 'rxjs/Observable';
import { DeepstreamService } from './deepstream.service';
import { Component } from '@angular/core';

@Component({
  selector: 'pwa-root',
  templateUrl: './app.component.html',
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
