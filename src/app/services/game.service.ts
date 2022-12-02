import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameControlService } from './game-control.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private piecePositions: FieldOccupation[]
  fieldOccupationChange: Subject<FieldOccupation[]>  = new Subject()
  
  constructor(private gameControlService: GameControlService) {
    this.subscribeToFieldOccupationUpdates();
  }

  initiateNewGame(mode: string, color: string) {
    this.gameControlService.initiateNewGame("vs_computer")
  }

  private subscribeToFieldOccupationUpdates() {
    this.gameControlService.fieldOccupationChange()
      .subscribe((piecePositions: FieldOccupation[]) => {
        // if changed notify
        if(this.piecePositions != piecePositions) {
          this.fieldOccupationChange.next(piecePositions)
          this.piecePositions = piecePositions
        }
      });
  }
}
