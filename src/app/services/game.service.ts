import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameInfo } from '../model/game-info.model';
import { GameStartEvent } from '../model/game-start-event.model';
import { JoinGameRequest } from '../model/join-game-request.model';
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
  private playerId = ""
  private playerColor = ""
  private gameMode: string | null

  public colorPreference: string | null

  fieldOccupationChange: Subject<FieldOccupation[]> = new ReplaySubject()
  piecePositionChange: Subject<PiecePositionUpdate> = new ReplaySubject()
  gameStartEvent: Subject<GameStartEvent> = new ReplaySubject()
  waitingForPlayersEvent: Subject<string> = new ReplaySubject()
  possibleMovesUpdate: Subject<PossibleMoves> = new Subject()

  constructor(private gameControlService: GameControlService) {
    this.subscribeToMoveUpdates();
    this.subscribeToPossibleMoves();
    this.subscribteToGameStartEvent();
    this.subscribeToWaitingForOtherPlayersEvent();
  }

  initiateNewGame(mode: string, colorPreference: string | null) {
    this.colorPreference = colorPreference
    this.gameControlService.initiateNewGame(this.playerId, mode)
  }

  joinExistingGame(joinGameRequest: JoinGameRequest) {
    this.gameControlService.joinExistingGame(joinGameRequest)
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
      this.gameControlService.moveRequest(this.playerId, from, to)
      return true
    }
    return false;
  }

  canMove(color: string | null = null) {
    if(color && this.gameMode != "TEST_MODE") {
        return this.canPlayerMove && color.toLowerCase() == this.playerColor.toLowerCase()
    }
    return this.canPlayerMove
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
      this.possibleMovesUpdate.next(possibleMoves)
    })
  }

  private subscribteToGameStartEvent() {
    this.gameControlService.getGameStartedSubscription().subscribe((gameInfo: GameInfo) => {
      this.canPlayerMove = true
      this.gameMode = gameInfo.mode
      
      if (this.piecePositions != gameInfo.piecePositions) {
        this.fieldOccupationChange.next(gameInfo.piecePositions)
        this.piecePositions = gameInfo.piecePositions
      }

      this.playerId = gameInfo.player.id
      this.playerColor = gameInfo.player.color
      this.gameStartEvent.next({playerColor: this.playerColor})
    })
  }

  private subscribeToWaitingForOtherPlayersEvent() {
    this.gameControlService.getWaitingForOtherPlayersSubscription().subscribe((gameId: string) => {
      this.waitingForPlayersEvent.next(gameId)
    })
  }
}
