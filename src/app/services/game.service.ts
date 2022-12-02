import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { MoveRequest } from '../model/move-request.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { PossibleMoves } from '../model/possible-moves.model';
import { GameControlService } from './game-control.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private piecePositions: FieldOccupation[] // necessary?
  private moveRequest: MoveRequest | null
  private possibleMoves: PossibleMoves | null

  fieldOccupationChange: Subject<FieldOccupation[]> = new Subject()
  piecePositionChange: Subject<PiecePositionUpdate> = new Subject()

  constructor(private gameControlService: GameControlService) {
    this.subscribeToFieldOccupationUpdates();
    this.subscribeToMoveUpdates();
    this.subscribeToPossibleMoves();
  }

  initiateNewGame(mode: string, color: string) {
    this.gameControlService.initiateNewGame("vs_computer")
  }

  initiateMoveFrom(from: String) {
    this.gameControlService.requestPossibleMoves(from)
  }

  requestMove(from: String, to: String): boolean {

    if (this.moveRequest) {
      return false
    }

    if (this.possibleMoves?.from == from && this.possibleMoves.to.includes(to)) {
      this.moveRequest = { from, to }
      this.gameControlService.moveRequest(from, to)
      return true
    }
    return false;
  }

  private subscribeToFieldOccupationUpdates() {
    this.gameControlService.fieldOccupationChange()
      .subscribe((piecePositions: FieldOccupation[]) => {
        // if changed notify
        if (this.piecePositions != piecePositions) {
          this.fieldOccupationChange.next(piecePositions)
          this.piecePositions = piecePositions
        }
      });
  }

  private subscribeToMoveUpdates() {
    this.gameControlService.piecePositionUpdate().subscribe((update: PiecePositionUpdate) => {
      console.log("PIECE POSITION UPDATE")
      const from = update.primaryMove.from
      const to = update.primaryMove.to

     // const piece = this.piecePositions[from] necessary?
      this.moveRequest = null // todo something better
      this.piecePositionChange.next(update)
    })
  }

  private subscribeToPossibleMoves() {
    this.gameControlService.getPossibleMovesSubscription().subscribe((possibleMoves: PossibleMoves) => {
      console.log("POSSIBLE MOVES")
      console.log(possibleMoves)
      this.possibleMoves = possibleMoves
    })
  }
}
