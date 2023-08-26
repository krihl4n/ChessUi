import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GameInfoMessage, PiecePositionUpdate, PossibleMovesMessage } from "../model/messages";

@Injectable({
    providedIn: "root"
})
export class GameEventsService {

    private piecePositionUpdateSubject: Subject<PiecePositionUpdate> = new Subject()
    private rematchRequestedSubject: Subject<string> = new Subject()
    private joinedExistingGameSubject: Subject<GameInfoMessage> = new Subject()
    private waitingForOtherPlayersSubject: Subject<string> = new Subject()
    private possibleMovesSubject: Subject<PossibleMovesMessage> = new Subject()
    
    piecePositionUpdated(piecePosition: PiecePositionUpdate) {
        this.piecePositionUpdateSubject.next(piecePosition)
    }
    
    rematchRequested(gameId: string) {
        this.rematchRequestedSubject.next(gameId)
    }

    joinedExistingGame(gameInfo: GameInfoMessage) {
        this.joinedExistingGameSubject.next(gameInfo)
    }

    waitingForOtherPlayersMsgReceived(gameId: string) {
        this.waitingForOtherPlayersSubject.next(gameId)
    }

    possibleMovesReceived(possibleMovesMessage: PossibleMovesMessage) {
        this.possibleMovesSubject.next(possibleMovesMessage)
    }

    getPiecePositionUpdatedObservable() {
        return this.piecePositionUpdateSubject.asObservable()
    }

    getRematchRequestedObservable() {
        return this.rematchRequestedSubject.asObservable()
    }

    getJoinedExistingGameObservable() {
        return this.joinedExistingGameSubject.asObservable()
    }

    getWaitingForOtherPlayersObservable() {
        return this.waitingForOtherPlayersSubject.asObservable()
    }

    getPossibleMovesObservable() {
        return this.possibleMovesSubject.asObservable()
    }
}