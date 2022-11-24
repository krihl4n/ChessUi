import { Injectable } from '@angular/core';
import { GameControlService } from './game-control.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private gameControlService: GameControlService) { }

  initiateNewGame(mode: string, color: string) {
    this.gameControlService.initiateNewGame("vs_computer")
  }
}
