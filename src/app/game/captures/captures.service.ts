import { Injectable } from '@angular/core';
import { PiecePositionUpdateMessage } from 'src/app/model/messages';
import { GameStartEvent, Piece, Score } from 'src/app/model/typings';
import { GameEventsService } from 'src/app/services/game-events.service';
import { GameService } from 'src/app/services/game.service';

@Injectable({
  providedIn: 'root'
})
export class CapturesService {

  whitePlayerCaptures: Piece[] = []
  blackPlayerCaptures: Piece[] = []

  whitePlayerScore: string
  blackPlayerScore: string
  
  constructor(private gameEventsService: GameEventsService, private gameService: GameService) { 
    this.gameEventsService.getPiecePositionUpdatedObservable().subscribe((update: PiecePositionUpdateMessage) => {
        this.updateCaptures(update)
        this.setScore(update.score)
    })

    this.gameService.getGameStartedEventObservable()
      .subscribe((gameStarted: GameStartEvent) => {
          this.setCaptures(gameStarted)
          this.setScore(gameStarted.score)
      })
  }

  updateCaptures(update: PiecePositionUpdateMessage) {
    let capturedPiece = update.pieceCapture?.capturedPiece
    
    if(capturedPiece) {
      let capturesCollection = capturedPiece.color == "white" ? this.blackPlayerCaptures : this.whitePlayerCaptures
      if (update.reverted) {
        capturesCollection.pop()
      } else {
        capturesCollection.push(capturedPiece)
      }
    }
  }

  setCaptures(gameStarted: GameStartEvent) {
    this.whitePlayerCaptures = []
    this.blackPlayerCaptures = []
    gameStarted.captures.capturesOfBlackPlayer.forEach((piece: Piece) => {
      this.blackPlayerCaptures.push(piece)
    })
    gameStarted.captures.capturesOfWhitePlayer.forEach((piece: Piece) => {
      this.whitePlayerCaptures.push(piece)
    })
  }

  private setScore(score: Score) {
    let whiteScore = Math.floor(score.white)
    whiteScore == 0 ? this.whitePlayerScore = "" : this.whitePlayerScore = "+" + whiteScore

    let blackScore = Math.floor(score.black)
    blackScore == 0 ? this.blackPlayerScore = "" : this.blackPlayerScore = "+" + blackScore
  }
}
