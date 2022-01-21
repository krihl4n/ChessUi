import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GameControlService } from '../game-control.service';
import { FieldOccupation, Piece } from '../FieldOccupation';
import { PiecePositionUpdate } from '../PiecePositionUpdate';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  constructor(private gameControlService: GameControlService) { }

  positions = new Map<String, String>() // todo move this to a service
  private positionsUpdates: Subject<FieldOccupation[]> | undefined
  private piecePositionUpdates: Subject<PiecePositionUpdate> | undefined

  private selectedField: String | null = null

  ngOnInit(): void {
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
    })
  }

  ngOnDestroy(): void {
    this.positionsUpdates?.unsubscribe();
  }

  getPieceAt(field: String): String {
    return this.positions.get(field) || ""
  }

  isWhite(field: String) {
    return this.getPieceAt(field).startsWith('W')
  }

  onFieldSelected(field: String) {
    if(this.selectedField == field) {
      this.selectedField = null
    } else if (this.selectedField == null) {
      this.selectedField = field
    } else {
      this.gameControlService.movePiece(this.selectedField, field)
      this.selectedField = null
    }
  }

  isFieldSelected(field: String) {
    return field === this.selectedField
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
