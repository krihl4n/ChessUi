import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameStartEvent, PiecePositionUpdate } from 'src/app/model/messages';
import { Captures, Piece, Score } from 'src/app/model/typings';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-captures',
  templateUrl: './captures.component.html',
  styleUrls: ['./captures.component.css']
})
export class CapturesComponent implements OnInit, OnDestroy {

  @Input() player: string
  captures: string[] = []
  score: string

  private piecePositionSubscription: Subscription
  private gameStartedSubscription: Subscription

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.piecePositionSubscription = this.gameService.getPiecePositionChangeObservable().subscribe((update: PiecePositionUpdate) => {
      let playerColor = this.getPlayerColor(this.player)
      this.updateCaptures(playerColor, update)
      this.setScore(playerColor, update.score)
    })

    this.gameStartedSubscription = this.gameService.getGameStartedEventObservable()
      .subscribe((gameStarted: GameStartEvent) => {
        let playerColor = this.getPlayerColor(this.player)
        this.setCaptures(playerColor, gameStarted)
        this.setScore(playerColor, gameStarted.score)
      })
  }

  ngOnDestroy(): void {
    this.piecePositionSubscription?.unsubscribe()
    this.gameStartedSubscription?.unsubscribe()
  }

  updateCaptures(playerColor: string, update: PiecePositionUpdate) {
    let capturedPiece = update.pieceCapture?.capturedPiece
    if (capturedPiece && playerColor != capturedPiece.color) {
      if (update.reverted) {
        this.captures.pop()
      } else {
        this.push(capturedPiece.type)
      }
    }
  }

  setCaptures(playerColor: string, gameStarted: GameStartEvent) {
    let captures = this.getCaptures(playerColor, gameStarted.captures)
    captures.forEach((piece: Piece) => {
      this.push(piece.type)
    })
  }

  private setScore(playerColor: string, score: Score) {
    let s = Math.floor(this.getScore(playerColor, score))
    if (s == 0) {
      this.score = ""
    } else {
      this.score = " | +" + s
    }
  }

  private getScore(color: string, score: Score) {
    if (color == "white") {
      return score.white
    } else {
      return score.black
    }
  }

  private push(pieceType: string) {
    if (pieceType == "knight") {
      this.captures.push("n")
    } else {
      this.captures.push(pieceType[0].toLowerCase())
    }
  }

  private getPlayerColor(owner: string) {
    if (owner === "this_payer") {
      return this.gameService.getPlayerColor()
    } else {
      return this.gameService.getOpponentColor()
    }
  }

  private getCaptures(color: String, captures: Captures) {
    if (color === "white") {
      return captures.capturesOfWhitePlayer
    } else {
      return captures.capturesOfBlackPlayer
    }
  }
}
