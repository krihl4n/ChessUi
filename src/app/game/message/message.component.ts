import { Component, OnInit } from '@angular/core';
import { GameInfoService } from 'src/app/services/game-info.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  private static WHITE_PLAYER_WON = "white_player_won";
  private static BLACK_PLAYER_WON = "black_player_won";
  private static DRAW = "draw";

  constructor(private gameService: GameService, private gameInfoService: GameInfoService) { }

  ngOnInit(): void {
  }

  getMessage(): string {
    const result = this.gameService.gameResult
    if (result) {
      if (result.result == MessageComponent.WHITE_PLAYER_WON && this.gameInfoService.isPlayerWhite() ||
        result.result == MessageComponent.BLACK_PLAYER_WON && this.gameInfoService.isPlayerBlack()) {
        return "You won!"
      }
      if (result.result == MessageComponent.WHITE_PLAYER_WON && this.gameInfoService.isPlayerBlack() ||
        result.result == MessageComponent.BLACK_PLAYER_WON && this.gameInfoService.isPlayerWhite()) {
        return "You lost!"
      }
      if (result.result == MessageComponent.DRAW) {
        return "Draw!"
      }
      return result.result + " " + result.reason
    } else {
      if (this.gameInfoService.getPlayerColor() == this.gameService.getTurn()) {
        return "Your move"
      } else {
        return "Waiting for opponent"
      }
    }
  }
}
