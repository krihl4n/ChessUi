import { Injectable } from '@angular/core';
import { GameInfoMessage } from '../model/messages';
import { COLOR_BLACK, COLOR_WHITE, MODE_TEST } from '../model/typings';
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

  getOpponentColor(): string {
    return this.playerColor == COLOR_WHITE ? COLOR_BLACK : COLOR_WHITE
  }

  isTestMode() {
    return this.gameMode == MODE_TEST
  }

  isPlayerWhite() {
    return this.playerColor == COLOR_WHITE
  }

  isPlayerBlack() {
    return this.playerColor == COLOR_BLACK
  }
}
