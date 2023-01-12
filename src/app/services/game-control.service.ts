import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameResult } from '../model/game-result.model';
import { GameStateUpdate } from '../model/game-state-update.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { GameInfo } from '../model/game-info.model';
import { PossibleMoves } from '../model/possible-moves.model';
import { WebSocketAPIService } from './web-socket-api.service';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

  constructor(private webSocketApiService: WebSocketAPIService) { }

  connect() {
    this.webSocketApiService.connect()
      .then(() => {
        this.webSocketApiService.sendRequestPiecePositionsMsg("request_positions")
      });
  }

  disconnect() {
    this.webSocketApiService.disconnect();
  }

  moveRequest(playerId: String, from: String, to: String) {
    this.webSocketApiService.sendMoveMsg({playerId, from, to})
  }

  initiateNewGame(playerId: string, mode: string, colorPreference: string | null) {
    this.webSocketApiService.connect()
      .then(() => {
        this.startNewGame(playerId, mode, colorPreference)
      })
  }

  joinExistingGame(gameId: string) {
    this.webSocketApiService.connect()
      .then(() => {
        this.webSocketApiService.sendJoinGameMsg(gameId)
    })
  }

  private startNewGame(playerId: string, mode: string, colorPreference: string | null) {
    this.webSocketApiService.sendStartNewGameMsg({ playerId, mode, colorPreference })
  }


  startGame(mode: String) {
    this.webSocketApiService.sendGameControlsMsg("start_" + mode)
  }

  undoMove() {
    this.webSocketApiService.sendGameControlsMsg("undo_move")
  }

  redoMove() {
    this.webSocketApiService.sendGameControlsMsg("redo_move")
  }

  resign() {
    this.webSocketApiService.sendGameControlsMsg("resign")
  }

  requestPossibleMoves(field: String) {
    this.webSocketApiService.sendRequestPossibleMovesRequest(field)
  }

  fieldOccupationChange(): Subject<FieldOccupation[]> {
    return this.webSocketApiService.fieldOccupationChange
  }

  piecePositionUpdate(): Subject<PiecePositionUpdate> {
    return this.webSocketApiService.piecePositionUpdateSubject
  }

  getGameStateUpdatesSubscription(): Subject<GameStateUpdate> {
    return this.webSocketApiService.gameStateUpdateSubject
  }

  getPossibleMovesSubscription(): Subject<PossibleMoves> {
    return this.webSocketApiService.possibleMovesSubject
  }

  getGameResultSubscription(): Subject<GameResult> {
    return this.webSocketApiService.gameResultSubject
  }

  getGameStartedSubscription(): Subject<GameInfo> {
    return this.webSocketApiService.gameStartedSubject
  }

  getWaitingForOtherPlayersSubscription() : Subject<String> {
    return this.webSocketApiService.waitingForOtherPlayersSubject
  }
}
