import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { MoveRequest } from './MoveRequest';
import { PiecePositions } from './PiecePositions';
import { Subject } from 'rxjs';

// https://www.javaguides.net/2019/06/spring-boot-angular-8-websocket-example-tutorial.html

@Injectable({
    providedIn: "root"
})
export class WebSocketAPIService {
    webSocketEndPoint: string = 'http://localhost:8080/game';
    topic: string = "/topic/moves";
    topicGameControls: string = "/topic/gameControls";
    topicPiecePositions: string = "/topic/piecePositions";
    stompClient: any;

    piecePositionsReceivedSubject: Subject<PiecePositions[]>  = new Subject()

    constructor(){
    }

    connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        this.stompClient.connect({}, (frame: any) => {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
                _this.onMessageReceived(sdkEvent);
            });
            _this.stompClient.subscribe(_this.topicGameControls, function (sdkEvent: any) {
                _this.onMessageReceivedDifferentTopic(sdkEvent);
            });
            _this.stompClient.subscribe(_this.topicPiecePositions, function (sdkEvent: any) {
                _this.onPiecePositionsReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error: any) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    send(message: MoveRequest) {
        this.stompClient.send("/chessApp/game", {}, JSON.stringify(message));
    }

    sendGameControlsMsg(message: String) {
        this.stompClient.send("/chessApp/gameControls", {}, JSON.stringify(message));
    }

    sendReqestPiecePositionsMsg(message: String) {
        this.stompClient.send("/chessApp/piecePositions", {}, JSON.stringify(message));
    }

    onMessageReceived(message: any) {
        console.log("Message Recieved from Server :: " + message);
    }

    onMessageReceivedDifferentTopic(message: any) {
        console.log("DifferentTopic Message Recieved from Server :: " + message);
    }

    onPiecePositionsReceived(message: Stomp.Frame) {
        let value = JSON.parse(message.body)
        console.log("Piece Positions recieved from Server");
        this.piecePositionsReceivedSubject.next(value)
    }
}