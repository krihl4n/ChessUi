import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { Piece } from '../model/piece.model';
import { GameControlService } from './game-control.service';

@Injectable({
  providedIn: 'root'
})
export class GameTrackerService {

  captures: String[] = []

  positions = new Map<String, String>() // todo move this to a service
  private positionsUpdates: Subject<FieldOccupation[]> | undefined
  private piecePositionUpdates: Subject<PiecePositionUpdate> | undefined // todo learn obout subjects and ngrx

  constructor(private gameControlService: GameControlService) {
    this.init()
  }

  init(): void {
    this.positionsUpdates = this.gameControlService.getPiecePositionsSubscription()
    this.positionsUpdates.subscribe((piecePositions: FieldOccupation[]) => {
      for (let i = 0; i < piecePositions.length; i++) {
        this.positions.set(piecePositions[i].field, this.getTokenFor(piecePositions[i].piece))
      }
    })

    this.piecePositionUpdates = this.gameControlService.getPiecePositionUpdatesSubscription();
    this.piecePositionUpdates.subscribe((update: PiecePositionUpdate) => {

      if(!update.reverted) {
        let piece = this.positions.get(update.primaryMove.from)
        this.positions.delete(update.primaryMove.from)
        this.positions.set(update.primaryMove.to, piece || "X_X") // todo something better than X_X
  
        if(update.secondaryMove) {
          let piece = this.positions.get(update.secondaryMove.from)
          this.positions.delete(update.secondaryMove.from)
          this.positions.set(update.secondaryMove.to, piece || "X_X") // todo something better than X_X
        }
      } else {
        let piece = this.positions.get(update.primaryMove.to)
        this.positions.delete(update.primaryMove.to)
        this.positions.set(update.primaryMove.from, piece || "X_X") // todo something better than X_X
  
        if(update.secondaryMove) {
          let piece = this.positions.get(update.secondaryMove.to)
          this.positions.delete(update.secondaryMove.to)
          this.positions.set(update.secondaryMove.from, piece || "X_X") // todo something better than X_X
        }
      }
      
      if (update.pieceCapture) {
        if (!update.reverted) {
          this.captures.push(this.getTokenFor(update.pieceCapture.capturedPiece))
        } else {
           this.captures.pop() 
        }
      }
    })
  }


  private getTokenFor(piece: Piece): String {
    if(piece == null) {
      return "";
    }

    let token = "";
    token += this.getTokenForColor(piece.color);
    token += "_";
    token += this.getTokenForType(piece.type);
    return token;
  }

  private getTokenForColor(color: String): String {
    if (color === 'WHITE') {
      return "W"
    } else {
      return "B"
    }
  }

  private getTokenForType(type: String): String {
    switch (type) {
      case "KING": {
        return "K"
      }
      case "QUEEN": {
        return "Q"
      }
      case "KNIGHT": {
        return "N"
      }
      case "BISHOP": {
        return "B"
      }
      case "ROOK": {
        return "R"
      }
      case "PAWN": {
        return "P"
      }
      default: {
        return ""
      }
    }
  }
}
