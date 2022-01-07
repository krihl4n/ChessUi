import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { GameControlService } from '../game-control.service';
import { Piece, PiecePositions } from '../PiecePositions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  constructor(private gameControlService: GameControlService) { }

  positions = new Map<String, String>()
  private positionUpdates: Subject<PiecePositions[]> | undefined

  ngOnInit(): void {
    this.positionUpdates = this.gameControlService.getPiecePositionUpdateSubscription()

    this.positionUpdates.subscribe((piecePositions: PiecePositions[]) => {
      for (let i = 0; i < piecePositions.length; i++) {
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
