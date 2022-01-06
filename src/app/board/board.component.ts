import { Component, OnDestroy, OnInit } from '@angular/core';
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

  private positionUpdates: Subject<PiecePositions[]> | undefined

  ngOnInit(): void {
    this.positionUpdates = this.gameControlService.getPiecePositionUpdateSubscription()

    this.positionUpdates.subscribe((piecePositions: PiecePositions[]) => {
        console.log("Piece positions received: " + piecePositions)
    })
  }

  ngOnDestroy(): void {
    this.positionUpdates?.unsubscribe();
  }
}
