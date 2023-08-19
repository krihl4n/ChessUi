import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Captures, Score } from 'src/app/model/game-info.model';
import { GameStartEvent } from 'src/app/model/game-start-event.model';
import { PiecePositionUpdate } from 'src/app/model/piece-position-update.model';
import { Piece } from 'src/app/model/piece.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-captures',
  templateUrl: './captures.component.html',
  styleUrls: ['./captures.component.css']
})
export class CapturesComponent implements OnInit {

  @Input() owner: string
  captures: string[] = []
  score: string

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getPiecePositionChangeObservable().subscribe((update: PiecePositionUpdate) => {
      let playerColor = this.getPlayerColor(this.owner)
      let capturedPiece = update.pieceCapture?.capturedPiece
      if(capturedPiece && playerColor != capturedPiece.color) {
        if(update.reverted) {
          this.captures.pop()
        } else {
          this.push(capturedPiece.type)
        }
      }
      this.setScore( playerColor, update.score)
    })

    this.gameService.getGameStartedEventObservable()
    .subscribe((gameStarted: GameStartEvent) => {
      let playerColor = this.getPlayerColor(this.owner)
      let captures = this.getCaptures(playerColor, gameStarted.captures)
      captures.forEach((piece: Piece) => {
            this.push(piece.type)
          })
      this.setScore(playerColor, gameStarted.score)
    })
  }

  private setScore(playerColor: string, score: Score) {
    let s
    if(this.gameService.getPlayerColor() == playerColor) {
      s = score.white
    } else {
      s = score.black
    }

    s = Math.floor(s)
    if(s == 0) {
      this.score = ""
    } else {
      this.score = "+" + s
    }
  }

  private push(pieceType: string) {
    if(pieceType == "knight") {
      this.captures.push("n")
    } else {
      this.captures.push(pieceType[0].toLowerCase())
    }
  }

  private getPlayerColor(owner: string) {
    if(owner === "player") {
      return this.gameService.getPlayerColor()
    } else {
      return this.gameService.getOpponentColor()
    }
  }

  private getCaptures(color: String, captures: Captures) {
    if(color === "white") {
      return captures.capturesOfWhitePlayer
    } else {
      return captures.capturesOfBlackPlayer
    }
  }
}
