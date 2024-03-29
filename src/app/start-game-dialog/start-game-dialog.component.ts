import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameService } from '../services/game.service';
import {Clipboard} from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameEventsService } from '../services/game-events.service';
import { COLOR_BLACK, COLOR_WHITE, MODE_TEST, MODE_VS_COMPUTER, MODE_VS_FRIEND } from '../model/typings';

@Component({
  selector: 'app-start-game-dialog',
  templateUrl: './start-game-dialog.component.html',
  styleUrls: ['./start-game-dialog.component.scss']
})
export class StartGameDialogComponent implements OnInit, OnDestroy {

  private gameStartedEventSubscription: Subscription
  private waitingForPlayersEventSubscription: Subscription

  constructor(private dialogRef: MatDialogRef<StartGameDialogComponent>, private gameService: GameService, private clipboard: Clipboard, private router: Router, private gameEventsService: GameEventsService) { }
  
  ngOnInit(): void {
    this.waitingForPlayersEventSubscription = this.gameEventsService.getWaitingForOtherPlayersObservable().subscribe((gameId: string) => {
      if(this.isFriendSelected) {
        this.showFirstScreen = false
        this.invitationUrl = window.location.href + "/" + gameId
      }
    })
    this.gameStartedEventSubscription = this.gameService.getGameStartedEventObservable().subscribe(() => {
      this.dialogRef.close();
    })
  }

  ngOnDestroy(): void {
    this.gameStartedEventSubscription?.unsubscribe()
    this.waitingForPlayersEventSubscription?.unsubscribe()
  }

  invitationUrl = ""
  showFirstScreen = true

  isWhiteColorSelected = false
  isRandomColorSelected = false
  isBlackColorSelected = false

  isComputerSelected = false
  isFriendSelected = false
  isTestSelected = false

  pieceSetup ="default"

  goToFirstScreen() {
    this.showFirstScreen = true

    this.isWhiteColorSelected = false
    this.isRandomColorSelected = false
    this.isBlackColorSelected = false
    this.isComputerSelected = false
    this.isFriendSelected = false
    this.isTestSelected = false
    this.dialogRef.close();
    this.router.navigate(["game"])
  }

  copyToClipboard() {
    this.clipboard.copy(this.invitationUrl)
  }

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
      this.gameService.initiateNewGame(this.determineSelectedMode(), this.pieceSetup, this.determineSelectedColor())  
    }
  }

  private colorSelected(): Boolean {
    return this.isWhiteColorSelected || this.isBlackColorSelected || this.isRandomColorSelected
  }

  private modeSelected(): Boolean {
    return this.isComputerSelected || this.isFriendSelected || this.isTestSelected
  }

  private determineSelectedColor(): string | undefined {
    if (this.isWhiteColorSelected) return COLOR_WHITE
    if (this.isBlackColorSelected) return COLOR_BLACK
    return undefined
  }

  private determineSelectedMode(): string {
    if (this.isFriendSelected) return MODE_VS_FRIEND
    if (this.isTestSelected) return MODE_TEST
    else return MODE_VS_COMPUTER
  }
}
