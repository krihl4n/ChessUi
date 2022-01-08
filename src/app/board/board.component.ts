import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GameControlService } from '../game-control.service';
import { FieldOccupation, Piece } from '../FieldOccupation';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  constructor(private gameControlService: GameControlService) { }

  positions = new Map<String, String>()
  private positionUpdates: Subject<FieldOccupation[]> | undefined
  private selectedField: String | null = null

  ngOnInit(): void {
    this.positionUpdates = this.gameControlService.getPiecePositionUpdateSubscription()

    this.positionUpdates.subscribe((piecePositions: FieldOccupation[]) => {
      for (let i = 0; i < piecePositions.length; i++) {
         // todo more verbose communication needed, do not refresh all the board every time
        this.positions.set(piecePositions[i].field, this.getTokenFor(piecePositions[i].piece))
      }
    })
  }

  ngOnDestroy(): void {
    this.positionUpdates?.unsubscribe();
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
