import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { WebSocketAPIService } from './web-socket-api.service';

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
  }

  undoMove() {
    this.webSocketApiService.sendGameControlsMsg("undo_move")
  }

  redoMove() {
    this.webSocketApiService.sendGameControlsMsg("redo_move")
  }

  getPiecePositionsSubscription(): Subject<FieldOccupation[]> {
    return this.webSocketApiService.piecePositionsReceivedSubject
  }

  getPiecePositionUpdatesSubscription(): Subject<PiecePositionUpdate>{
    return this.webSocketApiService.piecePositionUpdateSubject
  }
}
