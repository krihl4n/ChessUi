import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameInfoMessage, PiecePositionUpdateMessage } from 'src/app/model/messages';
import { Captures, COLOR_WHITE, GameStartEvent, KNIGHT, Piece, Score } from 'src/app/model/typings';
import { GameEventsService } from 'src/app/services/game-events.service';
import { GameInfoService } from 'src/app/services/game-info.service';
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

  constructor(private gameService: GameService, private gameEventsService: GameEventsService, private gameInfoService: GameInfoService) { }

  ngOnInit(): void {
    this.piecePositionSubscription = this.gameEventsService.getPiecePositionUpdatedObservable().subscribe((update: PiecePositionUpdateMessage) => {
      let playerColor = this.getPlayerColor(this.player)
      if (playerColor) {
        this.updateCaptures(playerColor, update)
        this.setScore(playerColor, update.score)
      }
    })

    this.gameStartedSubscription = this.gameService.getGameStartedEventObservable()
      .subscribe((gameStarted: GameStartEvent) => {
        let playerColor = this.getPlayerColor(this.player)
        if (playerColor) {
          this.setCaptures(playerColor, gameStarted)
          this.setScore(playerColor, gameStarted.score)
        }
      })
  }

  ngOnDestroy(): void {
    this.piecePositionSubscription?.unsubscribe()
    this.gameStartedSubscription?.unsubscribe()
  }

  updateCaptures(playerColor: string, update: PiecePositionUpdateMessage) {
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
    if (color == COLOR_WHITE) {
      return score.white
    } else {
      return score.black
    }
  }

  private push(pieceType: string) {
    if (pieceType == KNIGHT) {
      this.captures.push("n")
    } else {
      this.captures.push(pieceType[0].toLowerCase())
    }
  }

  private getPlayerColor(owner: string) {
    if (owner === "this_payer") {
      return this.gameInfoService.getPlayerColor()
    } else {
      return this.gameInfoService.getOpponentColor()
    }
  }

  private getCaptures(color: String, captures: Captures) {
    if (color === COLOR_WHITE) {
      return captures.capturesOfWhitePlayer
    } else {
      return captures.capturesOfBlackPlayer
    }
  }
}
