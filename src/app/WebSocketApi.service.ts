import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { MoveRequest } from './MoveRequest';

@Injectable({
    providedIn: "root"
})
export class WebSocketAPIService {
    webSocketEndPoint: string = 'http://localhost:8080/game';
    topic: string = "/topic/moves";
    topicGameControls: string = "/topic/gameControls";
    stompClient: any;

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
        console.log("calling logout api via web socket");
        this.stompClient.send("/chessApp/game", {}, JSON.stringify(message));
    }

    sendGameControlsMsg(message: String) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/chessApp/gameControls", {}, JSON.stringify(message));
    }

    onMessageReceived(message: any) {
        console.log("Message Recieved from Server :: " + message);
    }


    onMessageReceivedDifferentTopic(message: any) {
        console.log("DifferentTopic Message Recieved from Server :: " + message);
    }
}