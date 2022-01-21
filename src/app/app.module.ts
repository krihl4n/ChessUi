import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { ControlsComponent } from './controls/controls.component';
import { CapturesComponent } from './captures/captures.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ControlsComponent,
    CapturesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
