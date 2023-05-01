import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppComponent } from './app.component';
import { GameFinishedDialogComponent } from './game-finished-dialog/game-finished-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { BoardComponent } from './board/board.component';
import { StartGameDialogComponent } from './start-game-dialog/start-game-dialog.component';
import { GameComponent } from './game/game.component';
import { MessageComponent } from './game/message/message.component';
import { ControlsComponent } from './game/controls/controls.component';
import { PawnPromotionComponent } from './board/pawn-promotion/pawn-promotion.component';

@NgModule({
  declarations: [
    AppComponent,
    GameFinishedDialogComponent,
    BoardComponent,
    StartGameDialogComponent,
    GameComponent,
    MessageComponent,
    ControlsComponent,
    PawnPromotionComponent
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
