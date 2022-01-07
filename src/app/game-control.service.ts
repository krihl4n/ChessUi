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

  private moveUpdates: Subject<MoveResponse> | undefined

  connect() {
      this.webSocketApiService.connect();
  }

  disconnect() {
    this.webSocketApiService.disconnect();
  }

  movePiece(expression: String) {
    let fields = expression.split(" ")
    this.webSocketApiService.sendMoveMsg({"from": fields[0], "to":fields[1]});
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
