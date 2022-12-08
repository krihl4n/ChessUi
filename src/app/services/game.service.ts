import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { MoveRequest } from '../model/move-request.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { GameInfo } from '../model/piece-position-update.model copy';
import { PossibleMoves } from '../model/possible-moves.model';
import { GameControlService } from './game-control.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private piecePositions: FieldOccupation[] // necessary?
  private moveRequest: MoveRequest | null
  private possibleMoves: PossibleMoves | null
  private canPlayerMove: boolean = false

  fieldOccupationChange: Subject<FieldOccupation[]> = new Subject()
  piecePositionChange: Subject<PiecePositionUpdate> = new Subject()

  constructor(private gameControlService: GameControlService) {
    this.subscribeToFieldOccupationUpdates();
    this.subscribeToMoveUpdates();
    this.subscribeToPossibleMoves();
    this.subscribeToGameStartEvent();
  }

  initiateNewGame(mode: string, colorPreference: string | null) {
    this.gameControlService.initiateNewGame("vs_computer", colorPreference)
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

  canMove(): boolean {
    return this.canPlayerMove
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
      const from = update.primaryMove.from
      const to = update.primaryMove.to

     // const piece = this.piecePositions[from] necessary?
      this.moveRequest = null // todo something better
      this.piecePositionChange.next(update)
    })
  }

  private subscribeToPossibleMoves() {
    this.gameControlService.getPossibleMovesSubscription().subscribe((possibleMoves: PossibleMoves) => {
      this.possibleMoves = possibleMoves
    })
  }

  private subscribeToGameStartEvent() {
    this.gameControlService.getGameStartedSubscription().subscribe((gameInfo: GameInfo) => {
      console.log("game started, enabling board")
      this.canPlayerMove = true
    })
  }
}
