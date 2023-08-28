import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GameInfoMessage, GameResultMessage, PiecePositionUpdateMessage, PossibleMovesMessage } from "../model/messages";

@Injectable({
    providedIn: "root"
})
export class GameEventsService {

    private piecePositionUpdateSubject: Subject<PiecePositionUpdateMessage> = new Subject()
    private rematchRequestedSubject: Subject<string> = new Subject()
    private joinedExistingGameSubject: Subject<GameInfoMessage> = new Subject()
    private waitingForOtherPlayersSubject: Subject<string> = new Subject()
    private possibleMovesSubject: Subject<PossibleMovesMessage> = new Subject()
    private gameResultSubject: Subject<GameResultMessage> = new Subject()
    private gameStartedSubject: Subject<GameInfoMessage> = new Subject()

    piecePositionUpdated(piecePosition: PiecePositionUpdateMessage) {
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

    gameStartedMessageReceived(gameInfo: GameInfoMessage) {
        this.gameStartedSubject.next(gameInfo)
    }

    gameFinishedMessageReceived(gameResult: GameResultMessage) {
        this.gameResultSubject.next(gameResult)
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

    getGameStartedObservable() {
        return this.gameStartedSubject.asObservable()
    }

    getGameFinishedObservable() {
        return this.gameResultSubject.asObservable()
    }
}