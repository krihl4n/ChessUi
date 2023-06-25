import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameResult } from '../model/game-result.model';
import { GameStateUpdate } from '../model/game-state-update.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { GameInfo } from '../model/game-info.model';
import { PossibleMoves } from '../model/possible-moves.model';
import { WebSocketAPIService } from './web-socket-api.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameControlService { // rethink this component. is it needed? if so, who should be allowed to use it?

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
        var savedGame = this.storageService.getGame();
        if(savedGame) {
          this.webSocketApiService.sendRequestPiecePositionsMsg(savedGame.gameId)
        }
      });
  }

  disconnect() {
    this.webSocketApiService.disconnect();
    this.connected = false
  }

  moveRequest(playerId: String, from: String, to: String, pawnPromotion: String | null) {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendMoveMsg(
        {
          gameId: savedGame.gameId, 
          playerId: playerId, 
          from: from, 
          to: to, 
          pawnPromotion: pawnPromotion 
        }
      )
    } else {
      console.log("cannot send move request because there is no saved game")
    }
  }

  initiateNewGame(playerId: string, mode: string, pieceSetup: string) {
    this.webSocketApiService.connect()
      .then(() => {
        this.connected = true
        this.startNewGame(playerId, mode, pieceSetup)
      })
  }

  joinExistingGame(gameId: string, colorPreference: string | null, playerId: string | null) {
    if (this.connected) {
      this.joinGame(gameId, colorPreference, playerId)
    } else {
      this.webSocketApiService.connect()
        .then(() => {
          this.connected = true
          this.joinGame(gameId, colorPreference, playerId)
        })
    }
  }

  requestRematch() {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendRematchMsg(savedGame.gameId)
    } else {
      console.log("cannot request rematch because there is no saved game")
    }
  }

  private joinGame(gameId: string,
    colorPreference: string | null,
    playerId: string | null) {
    var savedGame = this.storageService.getGame();
    if (savedGame) {
      playerId = savedGame.playerId
    }
    if (savedGame?.gameId === gameId) {
      this.webSocketApiService.sendRejoinGameMsg({
        gameId: savedGame.gameId,
        playerId: savedGame.playerId
      })
    } else {
      this.webSocketApiService.sendJoinGameMsg({
        gameId: gameId,
        colorPreference: colorPreference,
        playerId: playerId
      })
    }
  }

  private startNewGame(playerId: string, mode: string, pieceSetup: string,) {
    this.webSocketApiService.sendStartNewGameMsg({ playerId, mode, setup: pieceSetup })
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

  getGameResultSubscription(): Observable<GameResult> {
    return this.webSocketApiService.gameResultSubject.asObservable()
  }

  getGameStartedSubscription(): Subject<GameInfo> {
    return this.webSocketApiService.gameStartedSubject
  }

  getWaitingForOtherPlayersSubscription(): Subject<string> {
    return this.webSocketApiService.waitingForOtherPlayersSubject
  }

  getRematchRequestedSubscription(): Subject<string> {
    return this, this.webSocketApiService.rematchRequestedSubject
  }

  getJoinedExistingGameSubscription(): Subject<GameInfo> {
    return this.webSocketApiService.joinedExistingGameSubject
  }
}
