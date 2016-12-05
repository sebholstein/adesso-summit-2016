import { RouterModule, Routes } from '@angular/router';
import { DeepstreamService } from './deepstream.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material'

import { AppComponent } from './app.component';
import { EnterNameComponent } from './enter-name/enter-name.component';
import { SpeechDialogComponent } from './speech-dialog/speech-dialog.component';
import { WebAudioDialogComponent } from './web-audio-dialog/web-audio-dialog.component';

const routes: Routes = [
  {path: '', component: EnterNameComponent},
  {path: 'schedule', loadChildren: './schedule/schedule.module#ScheduleModule'}
];

@NgModule({
  declarations: [
    AppComponent,
    EnterNameComponent,
    SpeechDialogComponent,
    WebAudioDialogComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    DeepstreamService
  ],
  entryComponents: [
    SpeechDialogComponent,
    WebAudioDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
