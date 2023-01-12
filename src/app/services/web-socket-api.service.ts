import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { MoveRequest } from '../model/move-request.model';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { PossibleMoves } from '../model/possible-moves.model';
import { GameStateUpdate } from '../model/game-state-update.model';
import { GameResult } from '../model/game-result.model';
import { StartGameRequest } from '../model/start-game-request.model';
import { GameInfo } from '../model/game-info.model';

// https://www.javaguides.net/2019/06/spring-boot-angular-8-websocket-example-tutorial.html

@Injectable({
    providedIn: "root"
})
export class WebSocketAPIService {
    webSocketEndPoint: string = 'http://localhost:8080/game';
    stompClient: any;
    fieldOccupationChange: Subject<FieldOccupation[]>  = new Subject()
    piecePositionUpdateSubject: Subject<PiecePositionUpdate> = new Subject()
    gameStateUpdateSubject: Subject<GameStateUpdate> = new Subject()
    gameResultSubject: Subject<GameResult> = new Subject()
    possibleMovesSubject: Subject<PossibleMoves> = new Subject()
    gameStartedSubject: Subject<GameInfo> = new Subject()
    waitingForOtherPlayersSubject: Subject<String> = new Subject()

    constructor(){
    }

    connect(): Promise<void> {
        return new Promise(resolve => {
            let ws = new SockJS(this.webSocketEndPoint);
            this.stompClient = Stomp.over(ws);
            const _this = this;
            this.stompClient.connect({}, (frame: any) => {
    
                var url = _this.stompClient.ws._transport.url;
                url = url.replace("ws://localhost:8080/game/",  "");
                url = url.replace("/websocket", "");
                url = url.replace(/^[0-9]+\//, "");
                console.log("Your current session is: " + url);
    
                // todo can this be simplified/
                _this.stompClient.subscribe("/user/queue/game-state-updates" + '-user' + url, function (sdkEvent: any) {
                    _this.onGameStateUpdate(sdkEvent);
                });
                _this.stompClient.subscribe("/user/queue/game-result" + '-user' + url, function (sdkEvent: any) {
                    _this.onGameResultReceived(sdkEvent);
                });
                _this.stompClient.subscribe("/user/queue/game-started" + '-user' + url, function (sdkEvent: any) {
                    _this.onGameStarted(sdkEvent)
                });
                _this.stompClient.subscribe("/user/queue/piece-position-updates" + '-user' + url, function (sdkEvent: any) {
                    _this.onPiecePositionUpdate(sdkEvent);
                });
                _this.stompClient.subscribe('/user/queue/game-controls' + '-user' + url, function (sdkEvent: any) {
                    _this.gameControlsMsgReceived(sdkEvent);
                });
                _this.stompClient.subscribe('/user/queue/fields-occupation' + '-user' + url, function (sdkEvent: any) {
                    _this.onPiecePositionsReceived(sdkEvent);
                });
                _this.stompClient.subscribe('/user/queue/possible-moves' + '-user' + url, function (sdkEvent: any) {
                    _this.onPossibleMovesReceived(sdkEvent);
                });
                _this.stompClient.subscribe('/user/queue/waiting-for-other-player' + '-user' + url, function (sdkEvent: any) {
                    _this.onWaitingForOtherPlayersReceived(sdkEvent);
                });
                //_this.stompClient.reconnect_delay = 2000;
                //callback.connected();
                //callback()
                resolve()
            }, this.errorCallBack);
        })    
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error: any) {
        // console.log("errorCallBack -> " + error)
        // setTimeout(() => {
        //     this.connect();
        // }, 5000); <= todo fix that
    }

    sendMoveMsg(message: MoveRequest) {
       this.stompClient.send("/chess-app/move", {}, JSON.stringify(message));
    }

    sendGameControlsMsg(message: String) {
        this.stompClient.send("/chess-app/game-controls", {}, message);
    }

    sendStartNewGameMsg(message: StartGameRequest) {
        this.stompClient.send("/chess-app/start-new-game", {}, JSON.stringify(message));
    }

    sendJoinGameMsg(gameId: String) {
        this.stompClient.send("/chess-app/join-game", {}, gameId);
    }

    sendRequestPiecePositionsMsg(message: String) {
        this.stompClient.send("/chess-app/fields-occupation", {}, JSON.stringify(message));
    }

    sendRequestPossibleMovesRequest(message: String) {
        this.stompClient.send("/chess-app/possible-moves", {}, message);
    }

    onGameStateUpdate(message: Stomp.Frame) {
        let value = JSON.parse(message.body)
        this.gameStateUpdateSubject.next(value)
    }

    onGameStarted(message: Stomp.Frame) {
        let value = JSON.parse(message.body)
        this.gameStartedSubject.next(value)
    }

    onPiecePositionUpdate(message: Stomp.Frame) {
        let value = JSON.parse(message.body)
        this.piecePositionUpdateSubject.next(value)
    }

    gameControlsMsgReceived(message: any) {
        console.log("DifferentTopic Message Recieved from Server :: " + message);
    }

    onPiecePositionsReceived(message: Stomp.Frame) {
        let value = JSON.parse(message.body)
        this.fieldOccupationChange.next(value)
    }

    onPossibleMovesReceived(message: Stomp.Frame) {
        let value = JSON.parse(message.body)
        this.possibleMovesSubject.next(value)
    }

    onGameResultReceived(message: Stomp.Frame) {
        let value = JSON.parse(message.body)
        this.gameResultSubject.next(value)
    }

    onWaitingForOtherPlayersReceived(message: Stomp.Frame) {
        this.waitingForOtherPlayersSubject.next(message.body)
    }
}
