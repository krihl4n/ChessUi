import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GameStateUpdate, PiecePositionUpdate } from "../model/messages";
import { FieldOccupation } from "../model/typings";
import { WebSocketAPIService } from "./web-socket-api.service";

@Injectable({
    providedIn: "root"
})
export class GameEventsService {

    private piecePositionUpdateSubject: Subject<PiecePositionUpdate> = new Subject()
    private rematchRequestedSubject: Subject<string> = new Subject()

    piecePositionUpdated(piecePosition: PiecePositionUpdate) {
        this.piecePositionUpdateSubject.next(piecePosition)
    }
    
    rematchRequested(gameId: string) {
        this.rematchRequestedSubject.next(gameId)
    }

    getPiecePositionUpdatedObservable() {
        return this.piecePositionUpdateSubject.asObservable()
    }

    getRematchRequestedObservable() {
        return this.rematchRequestedSubject.asObservable()
    }
}