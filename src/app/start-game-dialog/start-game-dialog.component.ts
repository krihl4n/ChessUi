import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { timeout } from 'rxjs-compat/operator/timeout';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-start-game-dialog',
  templateUrl: './start-game-dialog.component.html',
  styleUrls: ['./start-game-dialog.component.scss']
})
export class StartGameDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<StartGameDialogComponent>, private gameService: GameService) { }
  
  ngOnInit(): void {
    this.gameService.waitingForPlayersEvent.subscribe(() => {
      if(this.isFriendSelected) {
        this.showFirstScreen = false
      }
    })
    this.gameService.gameStartEvent.subscribe(() => {
      this.dialogRef.close();
    })
  }

  showFirstScreen = true

  isWhiteColorSelected = false
  isRandomColorSelected = false
  isBlackColorSelected = false

  isComputerSelected = false
  isFriendSelected = false
  isTestSelected = false

  whiteColorSelected() {
    this.isWhiteColorSelected = true
    this.isBlackColorSelected = false
    this.isRandomColorSelected = false
    this.initNewGame()
  }

  randomColorSelected() {
    this.isRandomColorSelected = true
    this.isWhiteColorSelected = false
    this.isBlackColorSelected = false
    this.initNewGame()
  }

  blackColorSelected() {
    this.isBlackColorSelected = true
    this.isWhiteColorSelected = false
    this.isRandomColorSelected = false
    this.initNewGame()
  }

  computerSelected() {
    this.isComputerSelected = true
    this.isFriendSelected = false
    this.isTestSelected = false
    this.initNewGame()
  }

  friendSelected() {
    this.isFriendSelected = true
    this.isComputerSelected = false
    this.isTestSelected = false
    this.initNewGame()
  }

  testSelected() {
    this.isFriendSelected = false
    this.isComputerSelected = false
    this.isTestSelected = true
    this.initNewGame()
  }

  private initNewGame() {
    if (this.colorSelected() && this.modeSelected()) {
      this.gameService.initiateNewGame(this.determineSelectedMode(), this.determineSelectedColor())  
    }
  }

  private colorSelected(): Boolean {
    return this.isWhiteColorSelected || this.isBlackColorSelected || this.isRandomColorSelected
  }

  private modeSelected(): Boolean {
    return this.isComputerSelected || this.isFriendSelected || this.isTestSelected
  }

  private determineSelectedColor(): string | null {
    if (this.isWhiteColorSelected) return "white"
    if (this.isBlackColorSelected) return "black"
    return null
  }

  private determineSelectedMode(): string {
    if (this.isFriendSelected) return "vs_friend"
    if (this.isTestSelected) return "test_mode"
    else return "vs_computer"
  }
}
