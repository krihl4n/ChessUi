import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from './FieldOccupation';
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
    this.webSocketApiService.sendGameControlsMsg("start_game")
    this.webSocketApiService.sendReqestPiecePositionsMsg("request_positions")
  }

  getPiecePositionUpdateSubscription(): Subject<FieldOccupation[]> {
    return this.webSocketApiService.piecePositionsReceivedSubject
  }
}
