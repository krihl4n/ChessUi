import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { GameControlService } from '../game-control.service';
import { PiecePositions } from '../PiecePositions';

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
      console.log("Piece positions received: " + piecePositions)
      for (let i = 0; i < piecePositions.length; i++) {
        this.positions.set(piecePositions[i].field, "X_X")
      }
    })
  }

  ngOnDestroy(): void {
    this.positionUpdates?.unsubscribe();
  }

  getPieceAt(field: String): String {
    return this.positions.get(field) || ""
  }
}
