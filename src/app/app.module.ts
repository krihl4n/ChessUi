import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppComponent } from './app.component';
import { ControlsComponent } from './controls/controls.component';
import { CapturesComponent } from './captures/captures.component';
import { GameFinishedDialogComponent } from './game-finished-dialog/game-finished-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { Board2Component } from './board2/board2.component';
import { StartGameDialogComponent } from './start-game-dialog/start-game-dialog.component';
import { Game2Component } from './game2/game2.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    CapturesComponent,
    GameFinishedDialogComponent,
    Board2Component,
    StartGameDialogComponent,
    Game2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
