import { Component, OnInit } from '@angular/core';
import { GameInfoMessage } from 'src/app/model/messages';
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
      if(result.result == "white_player_won" && this.gameInfoService.getPlayerColor() == 'white' || result.result == "black_player_won" && this.gameInfoService.getPlayerColor() == 'black') {
        return "You won!"
      }
      if(result.result == "white_player_won" && this.gameInfoService.getPlayerColor() == 'black' || result.result == "black_player_won" && this.gameInfoService.getPlayerColor() == 'white') {
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
