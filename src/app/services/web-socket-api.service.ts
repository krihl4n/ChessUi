//import * as Stomp from 'stompjs';
//import * as SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { JoinGameRequest, MoveRequest, PossibleMovesRequest, RejoinGameRequest, ResignRequest, StartGameRequest, UndoMoveRequest } from '../model/requests';
import { GameInfoMessage, GameResultMessage} from '../model/messages';
import { GameEventsService } from './game-events.service';

// https://www.javaguides.net/2019/06/spring-boot-angular-8-websocket-example-tutorial.html

@Injectable({
    providedIn: "root"
})
export class WebSocketAPIService {
    client: Client;
    gameResultSubject: Subject<GameResultMessage> = new Subject()
    gameStartedSubject: Subject<GameInfoMessage> = new Subject() // next 

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
                    _this.onGameStarted(msg)
                })

                this.subscribe("/user/queue/waiting-for-other-player", function(msg) {
                    _this.gameEventsService.waitingForOtherPlayersMsgReceived(msg.body)
                })
                this.subscribe("/user/queue/game-result", function (msg) {
                    _this.onGameResultReceived(msg);
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

    private publish(dst: string, msg: any) {
        this.client.publish({
            destination: dst,
            body: msg
        })
    }

    sendMoveMsg(message: MoveRequest) {
       this.publish("/chess-app/move", JSON.stringify(message))
    }

    sendGameControlsMsg(message: string) {
        this.publish("/chess-app/game-controls", message)
    }

    sendRematchMsg(gameId: string) {
        this.publish("/chess-app/rematch", gameId)
    }

    sendResignMsg(message: ResignRequest) {
        this.publish("/chess-app/resign", JSON.stringify(message))
    }

    sendUndoMoveMsg(message: UndoMoveRequest) {
        this.publish("/chess-app/undo-move", JSON.stringify(message))
    }

    sendStartNewGameMsg(message: StartGameRequest) {
        this.publish("/chess-app/start-new-game", JSON.stringify(message))
    }

    sendJoinGameMsg(req: JoinGameRequest) {
        this.publish("/chess-app/join-game", JSON.stringify(req))
    }

    sendRejoinGameMsg(req: RejoinGameRequest) {
        this.publish("/chess-app/rejoin-game", JSON.stringify(req))
    }

    sendRequestPossibleMovesRequest(message: PossibleMovesRequest) {
        this.publish("/chess-app/possible-moves", JSON.stringify(message))
    }

    onGameStarted(message: Message) {
        let value = JSON.parse(message.body)
        this.gameStartedSubject.next(value)
    }

    onGameResultReceived(message: Message) {
        let value = JSON.parse(message.body)
        this.gameResultSubject.next(value)
    }
}
