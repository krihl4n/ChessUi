import { Component, OnInit } from '@angular/core';
import { GameStateUpdate } from '../model/game-state-update.model';
import { GameControlService } from '../services/game-control.service';

@Component({
  selector: 'app-game-finished-dialog',
  templateUrl: './game-finished-dialog.component.html',
  styleUrls: ['./game-finished-dialog.component.css']
})
export class GameFinishedDialogComponent implements OnInit {

  dialogCloseRequested = false;
  gameState: String = "";

  constructor(private gameControlService: GameControlService) { }
  
  ngOnInit(): void {
    this.gameControlService.getGameStateUpdatesSubscription().subscribe((update: GameStateUpdate) => {
      this.gameState = update.gameState
      this.dialogCloseRequested = false
    })
  }

  shouldBeVisible(): Boolean {
    return this.gameState == "FINISHED" && !this.dialogCloseRequested
  }

  closeDialog(): void {
    this.dialogCloseRequested = true
  }
}
