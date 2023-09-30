import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PiecePositionUpdateMessage } from 'src/app/model/messages';
import { Piece } from 'src/app/model/typings';
import { GameInfoService } from 'src/app/services/game-info.service';
import { CapturesService } from './captures.service';

@Component({
  selector: 'app-captures',
  templateUrl: './captures.component.html',
  styleUrls: ['./captures.component.css']
})
export class CapturesComponent {

  @Input() player: string
  captures: Piece[] = []
  score: string

  private piecePositionSubscription: Subscription
  private gameStartedSubscription: Subscription

  constructor(private gameInfoService: GameInfoService, private capturesService: CapturesService) { }

  getScore(): string {
    if (this.getPlayerColor() == 'white') {
      return this.capturesService.whitePlayerScore
    } else {
      return this.capturesService.blackPlayerScore
    }
  }

  getCaptures() {
    if (this.getPlayerColor() == 'white') {
      return this.capturesService.whitePlayerCaptures
    } else {
      return this.capturesService.blackPlayerCaptures
    }
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
        this.captures.push(capturedPiece)
      }
    }
  }

  private getPlayerColor() {
    if (this.player === "this_payer") {
      return this.gameInfoService.getPlayerColor()
    } else {
      return this.gameInfoService.getOpponentColor()
    }
  }
}
