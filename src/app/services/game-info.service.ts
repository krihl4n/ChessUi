import { Injectable } from '@angular/core';
import { GameInfoMessage } from '../model/messages';
import { GameEventsService } from './game-events.service';

@Injectable({
  providedIn: 'root'
})
export class GameInfoService {

  private playerColor: string
  private gameMode: string

  constructor(gameEventsService: GameEventsService) {
    gameEventsService.getGameStartedObservable().subscribe((gameInfo: GameInfoMessage) => {
      this.playerColor = gameInfo.player.color
      this.gameMode = gameInfo.mode
    })

    gameEventsService.getJoinedExistingGameObservable().subscribe((gameInfo: GameInfoMessage) => {
      this.playerColor = gameInfo.player.color
      this.gameMode = gameInfo.mode
    })
  }

  isCurrentPlayer(color: string) {
    return this.playerColor.toLowerCase() == color.toLowerCase()
  }

  getPlayerColor() {
    return this.playerColor
  }

  getOpponentColor(): string | undefined {
    if (this.playerColor === "white") {
      return "black"
    }
    if (this.playerColor === "black") {
      return "white"
    }
    return undefined
  }

  isTestMode() {
    return this.gameMode == "test_mode"
  }
}
