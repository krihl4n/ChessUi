import { Injectable } from '@angular/core';
import { WebSocketAPIService } from './web-socket-api.service';
import { StorageService } from '../storage.service';
import { GameInfoMessage, GameResultMessage} from '../model/messages';
import { GameEventsService } from './game-events.service';
import { Color } from '../model/typings';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

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

  moveRequest(from: string, to: string, pawnPromotion?: string) {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendMoveMsg(
        {
          gameId: savedGame.gameId, 
          playerId: savedGame.playerId, 
          from: from, 
          to: to, 
          pawnPromotion: pawnPromotion 
        }
      )
    } else {
      console.log("cannot send move request because there is no saved game")
    }
  }

  initiateNewGame(mode: string, pieceSetup: string) {
    this.webSocketApiService.connect()
      .then(() => {
        this.connected = true
        this.startNewGame(mode, pieceSetup)
      })
  }

  joinExistingGame(gameId: string, colorPreference?: Color) {
    if (this.connected) {
      this.joinGame(gameId, colorPreference)
    } else {
      this.webSocketApiService.connect()
        .then(() => {
          this.connected = true
          this.joinGame(gameId, colorPreference)
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
    colorPreference?: Color) {
    var savedGame = this.storageService.getGame();
    if (savedGame && savedGame?.gameId === gameId) {
      this.webSocketApiService.sendRejoinGameMsg({
        gameId: savedGame.gameId,
        playerId: savedGame.playerId
      })
    } else {
      this.webSocketApiService.sendJoinGameMsg({
        gameId: gameId,
        colorPreference: colorPreference
      })
    }
  }

  private startNewGame(mode: string, pieceSetup: string,) {
    this.webSocketApiService.sendStartNewGameMsg({ mode, setup: pieceSetup })
  }

  startGame(mode: string) {
    this.webSocketApiService.sendGameControlsMsg("start_" + mode)
  }

  undoMove() {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendUndoMoveMsg({gameId: savedGame.gameId, playerId: savedGame.playerId})
    }
  }

  resign() {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendResignMsg({gameId: savedGame.gameId, playerId: savedGame.playerId})
    }
  }

  requestPossibleMoves(field: string) {
    var savedGame = this.storageService.getGame();
    if(savedGame) {
      this.webSocketApiService.sendRequestPossibleMovesRequest({gameId: savedGame.gameId, field: field})
    }
  }
}
