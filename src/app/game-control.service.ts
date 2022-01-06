import { Injectable } from '@angular/core';
import { WebSocketAPIService } from './WebSocketApi.service';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

  constructor(private webSocketApiService: WebSocketAPIService) { }

  connect() {
      this.webSocketApiService.connect();
  }

  disconnect() {
    this.webSocketApiService.disconnect();
  }

  sendMsg(msg: String) {
    this.webSocketApiService.send({"from": "a2", "to":"a3"});
  }

  startGame() {
    this.webSocketApiService.sendGameControlsMsg("startGame")
  }
}
