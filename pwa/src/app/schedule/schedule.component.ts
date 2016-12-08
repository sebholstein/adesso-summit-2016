import { Observable } from 'rxjs/Observable';
import { DeepstreamService } from './../deepstream.service';
import { Component } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/take';

export interface ScheduleEntry {
  title: string;
  start: string;
  category: string;
  cinemaHall: number;
}

@Component({
  selector: 'pwa-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  scheduleEntries: ScheduleEntry[] = [];
  showVoteButton$: Observable<boolean>;

  constructor(http: Http, ds: DeepstreamService) {
    this.showVoteButton$ = ds.showVoteButton$;

    http.get('assets/schedule.json')
      .map(r => r.json())
      .take(1)
      .subscribe(entries => this.scheduleEntries = entries);
   }

   vote() {
     document.location.href = 'http://bit.ly/adsum12';
   }
}
