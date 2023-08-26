//import * as Stomp from 'stompjs';
//import * as SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { Injectable } from '@angular/core';
import { JoinGameRequest, MoveRequest, PossibleMovesRequest, RejoinGameRequest, ResignRequest, StartGameRequest, UndoMoveRequest } from '../model/requests';
import { GameEventsService } from './game-events.service';

// https://www.javaguides.net/2019/06/spring-boot-angular-8-websocket-example-tutorial.html

@Injectable({
    providedIn: "root"
})
export class WebSocketAPIService {
    client: Client; 

    constructor(private gameEventsService: GameEventsService){
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
                this.subscribe("/user/queue/game-started", function(msg) {
                    _this.gameEventsService.gameStartedMessageReceived(JSON.parse(msg.body))
                })
                this.subscribe("/user/queue/waiting-for-other-player", function(msg) {
                    _this.gameEventsService.waitingForOtherPlayersMsgReceived(msg.body)
                })
                this.subscribe("/user/queue/game-result", function (msg) {
                    _this.gameEventsService.gameFinishedMessageReceived(JSON.parse(msg.body))
                });
                this.subscribe("/user/queue/joined-existing-game", function (msg) {
                    _this.gameEventsService.joinedExistingGame(JSON.parse(msg.body))
                });
                this.subscribe("/user/queue/piece-position-updates", function (msg) {
                    _this.gameEventsService.piecePositionUpdated(JSON.parse(msg.body))
                });
                this.subscribe('/user/queue/possible-moves', function (msg) {
                    _this.gameEventsService.possibleMovesReceived(JSON.parse(msg.body))
                });
                this.subscribe('/user/queue/rematch-requested', function(msg) {
                    _this.gameEventsService.rematchRequested(msg.body)
                })

                resolve()
            }

            this.client.onStompError = function(frame) {
                console.log("ERROR")
                console.log(frame)
            }


            this.client.activate();
        })    
    }

    disconnect() {
        this.client.deactivate()
        console.log("Disconnected");
    }

    sendMoveMsg(msg: MoveRequest) {
       this.publish("/chess-app/move", msg)
    }

    sendGameControlsMsg(msg: string) {
        this.publishRaw("/chess-app/game-controls", msg)
    }

    sendRematchMsg(msg: string) {
        this.publishRaw("/chess-app/rematch", msg)
    }

    sendResignMsg(msg: ResignRequest) {
        this.publish("/chess-app/resign", msg)
    }

    sendUndoMoveMsg(msg: UndoMoveRequest) {
        this.publish("/chess-app/undo-move", msg)
    }

    sendStartNewGameMsg(msg: StartGameRequest) {
        this.publish("/chess-app/start-new-game", msg)
    }

    sendJoinGameMsg(msg: JoinGameRequest) {
        this.publish("/chess-app/join-game", msg)
    }

    sendRejoinGameMsg(msg: RejoinGameRequest) {
        this.publish("/chess-app/rejoin-game", msg)
    }

    sendRequestPossibleMovesRequest(msg: PossibleMovesRequest) {
        this.publish("/chess-app/possible-moves", msg)
    }

    private publish(dst: string, msg: any) {
        this.client.publish({
            destination: dst,
            body: JSON.stringify(msg)
        })
    }

    private publishRaw(dst: string, msg: any) {
        this.client.publish({
            destination: dst,
            body: msg
        })
    }
}
