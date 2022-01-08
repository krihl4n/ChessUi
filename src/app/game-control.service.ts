import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from './FieldOccupation';
import { MoveResponse } from './MoveResponse';
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

  movePiece(from: String, to: String) {
    this.webSocketApiService.sendMoveMsg({"from": from, "to": to})
  }

  startGame() {
    this.webSocketApiService.sendGameControlsMsg("start_game")
    this.webSocketApiService.sendRequestPiecePositionsMsg("request_positions")

    this.webSocketApiService.movePerformedSubject.subscribe((move: MoveResponse) => { // todo check how to handle subscriptions in the course project
      this.webSocketApiService.sendRequestPiecePositionsMsg("request_positions")
    })
  }

  getPiecePositionUpdateSubscription(): Subject<FieldOccupation[]> {
    return this.webSocketApiService.piecePositionsReceivedSubject
  }
}
