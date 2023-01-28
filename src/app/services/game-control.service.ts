import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameResult } from '../model/game-result.model';
import { GameStateUpdate } from '../model/game-state-update.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { GameInfo } from '../model/game-info.model';
import { PossibleMoves } from '../model/possible-moves.model';
import { WebSocketAPIService } from './web-socket-api.service';
import { JoinGameRequest } from '../model/join-game-request.model';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

  connected = false

  constructor(private webSocketApiService: WebSocketAPIService, private storageService: StorageService) { 
    this.subscribeToGameStartedEvent()
  }

  subscribeToGameStartedEvent() {
    this.webSocketApiService.gameStartedSubject.subscribe((gameInfo: GameInfo) => {
        this.storageService.save(gameInfo.gameId, gameInfo.player.id)
    })
  }

  connect() {
    this.webSocketApiService.connect()
      .then(() => {
        this.connected = true
        this.webSocketApiService.sendRequestPiecePositionsMsg("request_positions")
      });
  }

  disconnect() {
    this.webSocketApiService.disconnect();
    this.connected = false
  }

  moveRequest(playerId: String, from: String, to: String) {
    this.webSocketApiService.sendMoveMsg({ playerId, from, to })
  }

  initiateNewGame(playerId: string, mode: string) {
    this.webSocketApiService.connect()
      .then(() => {
        this.connected = true
        this.startNewGame(playerId, mode)
      })
  }

  joinExistingGame(req: JoinGameRequest) {
    if (this.connected) {
      this.joinGame(req)
    } else {
      this.webSocketApiService.connect()
        .then(() => {
          this.connected = true
          this.joinGame(req)
        })
    }
  }

  private joinGame(req: JoinGameRequest){ 
    var savedGame = this.storageService.getGame();
    if(savedGame && savedGame.gameId == req.gameId) {
      req.playerId = savedGame.playerId
    }
    this.webSocketApiService.sendJoinGameMsg(req)
  }

  private startNewGame(playerId: string, mode: string) {
    this.webSocketApiService.sendStartNewGameMsg({ playerId, mode })
  }

  startGame(mode: String) {
    this.webSocketApiService.sendGameControlsMsg("start_" + mode)
  }

  undoMove(playerId: string) {
    this.webSocketApiService.sendUndoMoveMsg(playerId)
  }

  redoMove(playerId: string) {
    this.webSocketApiService.sendRedoMoveMsg(playerId)
  }

  resign(playerId: string) {
    this.webSocketApiService.sendResignMsg(playerId)
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

  getWaitingForOtherPlayersSubscription(): Subject<string> {
    return this.webSocketApiService.waitingForOtherPlayersSubject
  }

  getJoinedExistingGameSubscription(): Subject<GameInfo> {
    return this.webSocketApiService.joinedExistingGameSubject
  }
}
