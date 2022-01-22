import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { GameControlService } from './game-control.service';

@Injectable({
  providedIn: 'root'
})
export class GameTrackerService {

  captures: string[] = []

  private piecePositionUpdates: Subject<PiecePositionUpdate> | undefined // todo learn obout subjects and ngrx
  
  constructor(private gameControlService: GameControlService) {
    this.init()
  }

  init(): void {
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
}
