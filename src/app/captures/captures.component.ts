import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GameControlService } from '../services/game-control.service';
import { PiecePositionUpdate } from '../model/piece-position-update.model';

@Component({
  selector: 'app-captures',
  templateUrl: './captures.component.html',
  styleUrls: ['./captures.component.css']
})
export class CapturesComponent implements OnInit, OnDestroy {

  captures: string[] = []

  constructor(private gameControlService: GameControlService) { }
  private piecePositionUpdates: Subject<PiecePositionUpdate> | undefined

  ngOnInit(): void {
    this.piecePositionUpdates = this.gameControlService.getPiecePositionUpdatesSubscription();
    this.piecePositionUpdates.subscribe((update: PiecePositionUpdate) => {
      if (update.pieceCapture) {
        if (!update.reverted) {
          this.captures.push("X_X")
        } else {
           this.captures.pop() 
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.piecePositionUpdates?.unsubscribe();
  }
}
