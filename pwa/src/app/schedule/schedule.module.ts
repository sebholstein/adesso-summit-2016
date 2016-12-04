import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    MaterialModule,
    ScheduleRoutingModule
  ],
  declarations: [ScheduleComponent]
})
export class ScheduleModule { }
