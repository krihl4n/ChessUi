import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  getMessage(): string {
    const result = this.gameService.gameResult
    if(result) {
      if(result.result == "WHITE_PLAYER_WON" && this.gameService.getPlayerColor() == 'white' || result.result == "BLACK_PLAYER_WON" && this.gameService.getPlayerColor() == 'black') {
        return "You won!"
      }
      if(result.result == "WHITE_PLAYER_WON" && this.gameService.getPlayerColor() == 'black' || result.result == "BLACK_PLAYER_WON" && this.gameService.getPlayerColor() == 'white') {
        return "You lost!"
      }
      if(result.result == "DRAW") {
        return "Draw!"
      }
      return result.result + " " + result.reason
    } else {
      if(this.gameService.getPlayerColor() == this.gameService.getTurn()) {
        return "Your move"
      } else {
        return "Waiting for opponent"
      }
    }
  }
}
