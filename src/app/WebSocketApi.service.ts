import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { MoveRequest } from './MoveRequest';
import { Subject } from 'rxjs';
import { FieldOccupation } from './FieldOccupation';
import { PiecePositionUpdate } from './PiecePositionUpdate';

// https://www.javaguides.net/2019/06/spring-boot-angular-8-websocket-example-tutorial.html

@Injectable({
    providedIn: "root"
})
export class WebSocketAPIService {
    webSocketEndPoint: string = 'http://localhost:8080/game';
    stompClient: any;
    piecePositionsReceivedSubject: Subject<FieldOccupation[]>  = new Subject()
    piecePositionUpdateSubject: Subject<PiecePositionUpdate> = new Subject()

    constructor(){
    }

    connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        this.stompClient.connect({}, (frame: any) => {

            var url = _this.stompClient.ws._transport.url;
            url = url.replace("ws://localhost:8080/game/",  "");
            url = url.replace("/websocket", "");
            url = url.replace(/^[0-9]+\//, "");
            console.log("Your current session is: " + url);

            _this.stompClient.subscribe("/user/queue/piece-position-updates" + '-user' + url, function (sdkEvent: any) {
                _this.onPiecePositionUpdate(sdkEvent);
            });

            _this.stompClient.subscribe('/user/queue/game-controls' + '-user' + url, function (sdkEvent: any) {
                _this.gameControlsMsgReceived(sdkEvent);
            });
            _this.stompClient.subscribe('/user/queue/fields-occupation' + '-user' + url, function (sdkEvent: any) {
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

    sendMoveMsg(message: MoveRequest) {
       this.stompClient.send("/chess-app/move", {}, JSON.stringify(message));
    }

    sendGameControlsMsg(message: String) {
        this.stompClient.send("/chess-app/game-controls", {}, message);
    }

    sendRequestPiecePositionsMsg(message: String) {
        this.stompClient.send("/chess-app/fields-occupation", {}, JSON.stringify(message));
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
        this.piecePositionsReceivedSubject.next(value)
    }
}