import { Injectable } from '@angular/core';
import { GameInfoMessage } from '../model/messages';
import { GameEventsService } from './game-events.service';

@Injectable({
  providedIn: 'root'
})
export class GameInfoService {

  private playerColor = ""

  constructor(gameEventsService: GameEventsService) {
    gameEventsService.getGameStartedObservable().subscribe((gameInfo: GameInfoMessage) => {
      this.playerColor = gameInfo.player.color
    })
   }

  getPlayerColor() {
    return this.playerColor
  }

  getOpponentColor() {
    if(this.playerColor === "white") {
      return "black"
    }
    if(this.playerColor === "black") {
      return "white"
    }

    return ""
  }
}
