import { Component, OnInit } from '@angular/core';
import { GameInfoMessage } from 'src/app/model/messages';
import { COLOR_BLACK, COLOR_WHITE } from 'src/app/model/typings';
import { GameInfoService } from 'src/app/services/game-info.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(private gameService: GameService, private gameInfoService: GameInfoService) { }

  ngOnInit(): void {
  }

  getMessage(): string {
    const result = this.gameService.gameResult
    if(result) {
      if(result.result == "white_player_won" && this.gameInfoService.getPlayerColor() == COLOR_WHITE || result.result == "black_player_won" && this.gameInfoService.getPlayerColor() == COLOR_BLACK) {
        return "You won!"
      }
      if(result.result == "white_player_won" && this.gameInfoService.getPlayerColor() == COLOR_BLACK || result.result == "black_player_won" && this.gameInfoService.getPlayerColor() == COLOR_WHITE) {
        return "You lost!"
      }
      if(result.result == "DRAW") {
        return "Draw!"
      }
      return result.result + " " + result.reason
    } else {
      if(this.gameInfoService.getPlayerColor() == this.gameService.getTurn()) {
        return "Your move"
      } else {
        return "Waiting for opponent"
      }
    }
  }
}
