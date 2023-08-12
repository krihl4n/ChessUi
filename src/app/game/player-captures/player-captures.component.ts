import { Component, OnInit } from '@angular/core';
import { PiecePositionUpdate } from 'src/app/model/piece-position-update.model';
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
        if(capturedPiece.type == "knight") {
          this.captures.push("n")
        } else {
          this.captures.push(capturedPiece.type[0].toLowerCase())
        }
      }
    })
  }
}
