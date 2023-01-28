import { Component, OnInit } from '@angular/core';
import { GameInfo } from 'src/app/model/game-info.model';
import { GameStartEvent } from 'src/app/model/game-start-event.model';
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
    if(this.gameService.getPlayerColor() == this.gameService.getTurn()) {
      return "Your move"
    } else {
      return "Waiting for the opponent's move"
    }
  }
}
