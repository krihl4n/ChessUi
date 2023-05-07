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
                this.subscribe("/user/queue/game-state-updates", function(msg) {
                    _this.onGameStateUpdate(msg)
                })

                this.subscribe("/user/queue/waiting-for-other-player", function(msg) {
                    _this.onWaitingForOtherPlayersReceived(msg)
                })

                this.subscribe("/user/queue/game-started", function(msg) {
                    _this.onGameStarted(msg)
                })

                this.subscribe("/user/queue/game-result", function (msg) {
                    _this.onGameResultReceived(msg);
                });

                this.subscribe("/user/queue/joined-existing-game", function (msg) {
                    _this.onJoinedExistingGame(msg)
                });
                this.subscribe("/user/queue/piece-position-updates", function (msg) {
                    _this.onPiecePositionUpdate(msg);
                });
                this.subscribe('/user/queue/fields-occupation', function (msg) {
                    _this.onPiecePositionsReceived(msg);
                });
                this.subscribe('/user/queue/possible-moves', function (msg) {
                    _this.onPossibleMovesReceived(msg);
                });

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

    sendGameControlsMsg(message: String) {
        this.publish("/chess-app/game-controls", message)
    }

    sendRematchMsg() {
        this.publish("/chess-app/rematch", "rematch")
    }

    sendResignMsg(playerId: string) {
        this.publish("/chess-app/resign", playerId)
    }

    sendUndoMoveMsg(playerId: string) {
        this.publish("/chess-app/undo-move", playerId)
    }

    sendRedoMoveMsg(playerId: string) {
        this.publish("/chess-app/redo-move", playerId)
    }

    sendStartNewGameMsg(message: StartGameRequest) {
        this.publish("/chess-app/start-new-game", JSON.stringify(message))
    }

    sendJoinGameMsg(req: JoinGameRequest) {
        this.publish("/chess-app/join-game", JSON.stringify(req))
    }

    sendRequestPiecePositionsMsg(message: String) {
        this.publish("/chess-app/fields-occupation", JSON.stringify(message))
    }

    sendRequestPossibleMovesRequest(message: String) {
        this.publish("/chess-app/possible-moves", message)
    }

    onGameStateUpdate(message: Message) {
        let value = JSON.parse(message.body)
        this.gameStateUpdateSubject.next(value)
    }

    onGameStarted(message: Message) {
        let value = JSON.parse(message.body)
        this.gameStartedSubject.next(value)
    }

    onJoinedExistingGame(message: Message) {
        let value = JSON.parse(message.body)
        this.joinedExistingGameSubject.next(value)
    }

    onPiecePositionUpdate(message: Message) {
        let value = JSON.parse(message.body)
        this.piecePositionUpdateSubject.next(value)
    }

    onPiecePositionsReceived(message: Message) {
        let value = JSON.parse(message.body)
        this.fieldOccupationChange.next(value)
    }

    onPossibleMovesReceived(message: Message) {
        let value = JSON.parse(message.body)
        this.possibleMovesSubject.next(value)
    }

    onGameResultReceived(message: Message) {
        let value = JSON.parse(message.body)
        this.gameResultSubject.next(value)
    }

    onWaitingForOtherPlayersReceived(message: Message) {
        this.waitingForOtherPlayersSubject.next(message.body)
    }
}
