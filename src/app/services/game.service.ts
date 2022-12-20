import { Injectable } from '@angular/core';
import { debug } from 'console';
import { ReplaySubject, Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameInfo } from '../model/game-info.model';
import { GameStartEvent } from '../model/game-start-event.model';
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
  private canPlayerMove: boolean = false
  private playerId = "player1" // todo generate id
  private playerColor = ""
  fieldOccupationChange: Subject<FieldOccupation[]> = new ReplaySubject()
  piecePositionChange: Subject<PiecePositionUpdate> = new ReplaySubject()
  gameStartEvent: Subject<GameStartEvent> = new ReplaySubject()
  possibleMovesUpdate: Subject<PossibleMoves> = new Subject()

  constructor(private gameControlService: GameControlService) {
    this.subscribeToFieldOccupationUpdates();
    this.subscribeToMoveUpdates();
    this.subscribeToPossibleMoves();
    this.subscribteToGameStartEvent();
  }

  initiateNewGame(mode: string, colorPreference: string | null) {
    this.gameControlService.initiateNewGame(this.playerId, mode, colorPreference)
  }

  initiateMoveFrom(from: String) {
    this.gameControlService.requestPossibleMoves(from)
  }

  requestMove(from: string, to: string): boolean {

    if (this.moveRequest) {
      return false
    }

    if (this.possibleMoves?.from == from && this.possibleMoves.to.includes(to)) {
      this.moveRequest = {playerId : this.playerId, from, to }
      this.gameControlService.moveRequest(from, to)
      return true
    }
    return false;
  }

  canMove(color: string | null = null) {
    if(color) {
        return this.canPlayerMove && color.toLowerCase() == this.playerColor.toLowerCase()
    }
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
      this.possibleMovesUpdate.next(possibleMoves)
    })
  }

  private subscribteToGameStartEvent() {
    this.gameControlService.getGameStartedSubscription().subscribe((gameInfo: GameInfo) => {
      this.canPlayerMove = true
      if(gameInfo.player1.id == this.playerId) {
        this.playerColor = gameInfo.player1.color
      } else {
        this.playerColor = gameInfo.player2.color
      }

      this.gameStartEvent.next({playerColor: this.playerColor})
    })
  }
}
