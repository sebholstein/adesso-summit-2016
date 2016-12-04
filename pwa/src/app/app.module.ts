import { RouterModule, Routes } from '@angular/router';
import { DeepstreamService } from './deepstream.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material'

import { AppComponent } from './app.component';
import { EnterNameComponent } from './enter-name/enter-name.component';

const routes: Routes = [
  {path: '', component: EnterNameComponent},
  {path: 'schedule', loadChildren: './schedule/schedule.module#ScheduleModule'}
];

@NgModule({
  declarations: [
    AppComponent,
    EnterNameComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    DeepstreamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
