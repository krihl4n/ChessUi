import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebSocketAPIService } from './web-socket-api.service';
import { StorageService } from '../storage.service';
import { GameInfoMessage, GameResultMessage} from '../model/messages';
import { GameEventsService } from './game-events.service';

@Injectable({
  providedIn: 'root'
})
export class GameControlService { // rethink this component. is it needed? if so, who should be allowed to use it?

  connected = false

  constructor(private webSocketApiService: WebSocketAPIService, private storageService: StorageService, private gameEventsService: GameEventsService) {
    this.subscribeToGameStartedEvent()
  }

  subscribeToGameStartedEvent() {
    this.gameEventsService.getGameStartedObservable().subscribe((gameInfo: GameInfoMessage) => {
      this.storageService.save(gameInfo.gameId, gameInfo.player.id)
    })
  }

  connect() {
    this.webSocketApiService.connect()
      .then(() => {
        this.connected = true
      });
  }

  disconnect() {
    this.webSocketApiService.disconnect();
    this.connected = false
  }

  moveRequest(playerId: string, from: string, to: string, pawnPromotion: string | null) {
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

  startGame(mode: string) {
    this.webSocketApiService.sendGameControlsMsg("start_" + mode)
  }

  undoMove(playerId: string) {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendUndoMoveMsg({gameId: savedGame.gameId, playerId})
    }
  }

  resign(playerId: string) {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendResignMsg({gameId: savedGame.gameId, playerId})
    }
  }

  requestPossibleMoves(field: string) {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendRequestPossibleMovesRequest({gameId: savedGame.gameId, field: field})
    }
  }
}
