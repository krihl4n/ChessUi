import { Component, OnInit } from '@angular/core';
import { GameStartEvent } from 'src/app/model/game-start-event.model';
import { PiecePositionUpdate } from 'src/app/model/piece-position-update.model';
import { Piece } from 'src/app/model/piece.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-player-captures',
  templateUrl: './player-captures.component.html',
  styleUrls: ['./player-captures.component.css']
})
export class PlayerCapturesComponent implements OnInit {

  captures: string[] = []

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getPiecePositionChangeObservable().subscribe((update: PiecePositionUpdate) => {
      let capturedPiece = update.pieceCapture?.capturedPiece
      if(capturedPiece && this.gameService.getPlayerColor() != capturedPiece.color) {
        if(update.reverted) {
          this.captures.pop()
        } else {
          this.push(capturedPiece.type)
          // if(capturedPiece.type == "knight") {
          //   this.captures.push("n")
          // } else {
          //   this.captures.push(capturedPiece.type[0].toLowerCase())
          // }
        }
      }
    })

    this.gameService.getGameStartedEventObservable()
    .subscribe((gameStarted: GameStartEvent) => {

      if(this.gameService.getPlayerColor() == "white") {
        gameStarted.captures.capturesOfWhitePlayer.forEach((piece: Piece) => {
          this.push(piece.type)
        })
      } else {
        gameStarted.captures.capturesOfBlackPlayer.forEach((piece: Piece) => {
          this.push(piece.type)
        })
      }
    })
  }

  private push(pieceType: string) {
    if(pieceType == "knight") {
      this.captures.push("n")
    } else {
      this.captures.push(pieceType[0].toLowerCase())
    }
  }
}
