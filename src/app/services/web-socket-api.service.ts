//import * as Stomp from 'stompjs';
//import * as SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
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
import { JoinGameRequest } from '../model/join-game-request.model';

// https://www.javaguides.net/2019/06/spring-boot-angular-8-websocket-example-tutorial.html

@Injectable({
    providedIn: "root"
})
export class WebSocketAPIService {
    webSocketEndPoint: string = 'http://localhost:8080/game';
    stompClient: any;
    client: Client;
    fieldOccupationChange: Subject<FieldOccupation[]>  = new Subject()
    piecePositionUpdateSubject: Subject<PiecePositionUpdate> = new Subject()
    gameStateUpdateSubject: Subject<GameStateUpdate> = new Subject()
    gameResultSubject: Subject<GameResult> = new Subject()
    possibleMovesSubject: Subject<PossibleMoves> = new Subject()
    gameStartedSubject: Subject<GameInfo> = new Subject()
    joinedExistingGameSubject: Subject<GameInfo> = new Subject()
    waitingForOtherPlayersSubject: Subject<string> = new Subject()

    constructor(){
    }

    connect(): Promise<void> {
        return new Promise(resolve => {
            this.client = new Client({
                brokerURL: 'ws://localhost:8080/game',
                debug: function (str) {
                    console.log(str);
                  },
                  reconnectDelay: 5000,
                  heartbeatIncoming: 4000,
                  heartbeatOutgoing: 4000,
                  logRawCommunication: true,
            })    

            const _this = this
            this.client.onConnect = function(frame) {
                console.log("CONNECTED")
                console.log(frame)
                console.log(this.brokerURL)
                //debugger
                _this.client.subscribe("/user/queue/game-state-updates", function(msg) {
                    _this.onGameStateUpdate(msg)
                })

                _this.client.subscribe("/user/queue/waiting-for-other-player", function(msg) {
                    _this.onWaitingForOtherPlayersReceived(msg)
                })

                _this.client.subscribe("/user/queue/game-started", function(msg) {
                    _this.onGameStarted(msg)
                })

                _this.client.subscribe("/user/queue/game-result", function (msg) {
                    _this.onGameResultReceived(msg);
                });

                _this.client.subscribe("/user/queue/joined-existing-game", function (msg) {
                    _this.onJoinedExistingGame(msg)
                });
                _this.client.subscribe("/user/queue/piece-position-updates", function (msg) {
                    _this.onPiecePositionUpdate(msg);
                });
                _this.client.subscribe('/user/queue/game-controls', function (msg) {
                    _this.gameControlsMsgReceived(msg);
                });
                _this.client.subscribe('/user/queue/fields-occupation', function (msg) {
                    _this.onPiecePositionsReceived(msg);
                });
                _this.client.subscribe('/user/queue/possible-moves', function (msg) {
                    _this.onPossibleMovesReceived(msg);
                });

                resolve()
            }

            this.client.onStompError = function(frame) {
                console.log("ERROR")
                console.log(frame)
            }


            this.client.activate();
            this.client.webSocket
            // let ws = new SockJS(this.webSocketEndPoint);
            // this.stompClient = Stomp.over(ws);
            // const _this = this;
            // this.stompClient.connect({}, (frame: any) => {
    
            //     var url = _this.stompClient.ws._transport.url;
            //     url = url.replace("ws://localhost:8080/game/",  "");
            //     url = url.replace("/websocket", "");
            //     url = url.replace(/^[0-9]+\//, "");
            //     console.log("Your current session is: " + url);
    
                // todo can this be simplified/
                // _this.stompClient.subscribe("/user/queue/game-state-updates" + '-user' + url, function (sdkEvent: any) {
                //     _this.onGameStateUpdate(sdkEvent);
                // });
                // _this.stompClient.subscribe("/user/queue/game-result" + '-user' + url, function (sdkEvent: any) {
                //     _this.onGameResultReceived(sdkEvent);
                // });
                // _this.stompClient.subscribe("/user/queue/game-started" + '-user' + url, function (sdkEvent: any) {
                //     _this.onGameStarted(sdkEvent)
                // });
                // _this.stompClient.subscribe("/user/queue/joined-existing-game" + '-user' + url, function (sdkEvent: any) {
                //     _this.onJoinedExistingGame(sdkEvent)
                // });
                // _this.stompClient.subscribe("/user/queue/piece-position-updates" + '-user' + url, function (sdkEvent: any) {
                //     _this.onPiecePositionUpdate(sdkEvent);
                // });
                // _this.stompClient.subscribe('/user/queue/game-controls' + '-user' + url, function (sdkEvent: any) {
                //     _this.gameControlsMsgReceived(sdkEvent);
                // });
                // _this.stompClient.subscribe('/user/queue/fields-occupation' + '-user' + url, function (sdkEvent: any) {
                //     _this.onPiecePositionsReceived(sdkEvent);
                // });
                // _this.stompClient.subscribe('/user/queue/possible-moves' + '-user' + url, function (sdkEvent: any) {
                //     _this.onPossibleMovesReceived(sdkEvent);
                // });
                // _this.stompClient.subscribe('/user/queue/waiting-for-other-player' + '-user' + url, function (sdkEvent: any) {
                //     _this.onWaitingForOtherPlayersReceived(sdkEvent);
                // });
  
                
                
//                resolve()
      //      }, this.errorCallBack);
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

    private publish(dst: string, msg: any) {
        this.client.publish({
            destination: dst,
            body: msg
        })
    }

    sendMoveMsg(message: MoveRequest) {
       this.publish("/chess-app/move", JSON.stringify(message))
      // this.stompClient.send("/chess-app/move", {}, JSON.stringify(message));
    }

    sendGameControlsMsg(message: String) {
        this.publish("/chess-app/game-controls", message)
        //this.stompClient.send("/chess-app/game-controls", {}, message);
    }

    sendStartNewGameMsg(message: StartGameRequest) {
        this.publish("/chess-app/start-new-game", JSON.stringify(message))
        // this.client.publish({
        //     destination: "/chess-app/start-new-game",
        //     body: JSON.stringify(message)
        // })
//        this.stompClient.send("/chess-app/start-new-game", {}, JSON.stringify(message));
    }

    sendJoinGameMsg(req: JoinGameRequest) {
        this.publish("/chess-app/join-game", JSON.stringify(req))
       // this.stompClient.send("/chess-app/join-game", {}, JSON.stringify(req));
    }

    sendRequestPiecePositionsMsg(message: String) {
        this.publish("/chess-app/fields-occupation", JSON.stringify(message))
        //this.stompClient.send("/chess-app/fields-occupation", {}, JSON.stringify(message));
    }

    sendRequestPossibleMovesRequest(message: String) {
        this.publish("/chess-app/possible-moves", message)
        //this.stompClient.send("/chess-app/possible-moves", {}, message);
    }

    onGameStateUpdate(message: any) {
        console.log("ON GAME STATE UPDATE")
        console.log(message.body)
        let value = JSON.parse(message.body)
        this.gameStateUpdateSubject.next(value)
    }

    onGameStarted(message: any) {
        let value = JSON.parse(message.body)
        this.gameStartedSubject.next(value)
    }

    onJoinedExistingGame(message: any) {
        let value = JSON.parse(message.body)
        this.joinedExistingGameSubject.next(value)
    }

    onPiecePositionUpdate(message: any) {
        let value = JSON.parse(message.body)
        this.piecePositionUpdateSubject.next(value)
    }

    gameControlsMsgReceived(message: any) {
        console.log("DifferentTopic Message Recieved from Server :: " + message);
    }

    onPiecePositionsReceived(message: any) {
        let value = JSON.parse(message.body)
        this.fieldOccupationChange.next(value)
    }

    onPossibleMovesReceived(message: any) {
        let value = JSON.parse(message.body)
        this.possibleMovesSubject.next(value)
    }

    onGameResultReceived(message: any) {
        let value = JSON.parse(message.body)
        this.gameResultSubject.next(value)
    }

    onWaitingForOtherPlayersReceived(message: any) {
        this.waitingForOtherPlayersSubject.next(message.body)
    }
}
