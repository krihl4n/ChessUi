import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameControlService } from '../services/game-control.service';
import { GameTrackerService } from '../services/game-tracker.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  constructor(private gameControlService: GameControlService, private gameTracker: GameTrackerService) { }

  private selectedField: String | null = null

  getPieceAt(field: String): String {
    return this.gameTracker.positions.get(field) || ""
  }

  isWhite(field: String) {
    return this.getPieceAt(field).startsWith('W')
  }

  onFieldSelected(field: String) {
    this.gameTracker.clearFieldsMarkedForMove()

    if(this.selectedField == field) {
      this.selectedField = null
    } else if (this.selectedField == null) {
      if(this.gameTracker.positions.get(field)){
        this.selectedField = field
        this.gameControlService.requestPossibleMoves(field)
      }
    } else {
     // this.gameControlService.moveRequest(this.selectedField, field)
      this.selectedField = null
    }
  }

  isFieldSelected(field: String) {
    return field === this.selectedField
  }

  isMarkedForMove(field:String) {
    return this.gameTracker.fieldMarkedForMove(field)
  }
}
