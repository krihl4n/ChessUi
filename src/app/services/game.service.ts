import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GameControlService } from './game-control.service';
import { PawnPromotionService } from '../board/pawn-promotion/pawn-promotion.service';
import { Promotion } from '../board/pawn-promotion/promotion.model';
import { GameInfoMessage, GameResultMessage, GameStartEvent, PiecePositionUpdate } from '../model/messages';
import { FieldOccupation, GameResult, Move, PossibleMoves } from '../model/typings';
import { GameEventsService } from './game-events.service';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {

  private moveRequestInProgress: boolean = false
  private possibleMoves: PossibleMoves | null
  private canPlayerMove: boolean = false
  private playerId = ""
  private playerColor = ""
  private turn = ""
  private gameMode: string | null
  public gameResult: GameResult | null // todo remove?
  public colorPreference: string | null
  public lastMove: Move | null // for field marking

  private gameStartEvent: Subject<GameStartEvent> = new Subject()
  private waitingForPlayersEvent: Subject<string> = new Subject()
  private possibleMovesUpdate: Subject<PossibleMoves> = new Subject()
  private pawnPromotionClosed: Subject<Promotion | null> = new Subject()
  private gameFinishedEvent: Subject<GameResult> = new Subject()

  private promotionClosedSubscription: Subscription

  constructor(private gameControlService: GameControlService, private gameEventsService: GameEventsService, private pawnPromotionService: PawnPromotionService) {
    this.subscribeToMoveUpdates();
    this.subscribeToPossibleMoves();
    this.subscribteToGameStartEvent();
    this.subscribeToWaitingForOtherPlayersEvent();
    this.subscribeToJoinedExistingGameEvent();
    this.subscribeToGameFinishedEvent();

    this.promotionClosedSubscription = this.pawnPromotionService.getPromotionClosedObservable().subscribe(promotion => {
      this.canPlayerMove = true
      this.pawnPromotionClosed.next(promotion)
      if (promotion) {
        this.requestMoveWithPromotion(promotion.from, promotion.to, promotion.promotion)
      }
    }
    )
  }

  ngOnDestroy(): void {
    this.promotionClosedSubscription?.unsubscribe()
  }

  getPromotionClosedObservable() {
    return this.pawnPromotionClosed.asObservable();
  }

  getGameStartedEventObservable() {
    return this.gameStartEvent.asObservable()
  }

  getWaitinForPlayersObservable() {
    return this.waitingForPlayersEvent.asObservable()
  }

  getPossibleMovesUpdateObservable() {
    return this.possibleMovesUpdate.asObservable()
  }

  getGameFinishedObservable() {
    return this.gameFinishedEvent.asObservable()
  }

  initiateNewGame(mode: string, colorPreference: string | null, pieceSetup: string) {
    this.colorPreference = colorPreference
    this.gameControlService.initiateNewGame(this.playerId, mode, pieceSetup)
  }

  joinExistingGame(gameId: string, colorPreference: string | null, playerId: string | null) {
    this.gameControlService.joinExistingGame(gameId, colorPreference, playerId)
  }

  rematch() {
    this.gameControlService.requestRematch()
  }

  initiateMoveFrom(from: string) {
    this.gameControlService.requestPossibleMoves(from)
  }

  private requestMoveWithPromotion(from: string, to: string, pawnPromotion: string) {
    this.pawnPromotionService.moveWithPromotionPerformed()
    this.moveRequestInProgress = true
    this.gameControlService.moveRequest(this.playerId, from, to, pawnPromotion) // TODO what happens if move failes on the backend side?
    return true
  }

  requestMove(from: string, to: string): MoveRequestResult {

    if (this.moveRequestInProgress) {
      return MoveRequestResult.REJECTED
    }

    if (this.possibleMoves?.from == from && this.possibleMoves.to.includes(to)) {
      if (this.pawnPromotionService.shouldOpenPromotionChoice(from, to, this.playerColor)) {
        this.pawnPromotionService.display(from, to)
        this.canPlayerMove = false
        return MoveRequestResult.DEFERRED
      }

      this.moveRequestInProgress = true
      this.gameControlService.moveRequest(this.playerId, from, to, null) // TODO what happens if move failes on the backend side?
      return MoveRequestResult.ACCEPTED
    }
    return MoveRequestResult.REJECTED;
  }

  canMove(color: string | null = null) {
    if (color && this.gameMode != "test_mode") {
      return this.canPlayerMove && color.toLowerCase() == this.playerColor.toLowerCase() && this.turn == this.playerColor
    }
    return this.canPlayerMove
  }

  getTurn() {
    return this.turn
  }

  getPlayerColor() {
    return this.playerColor
  }

  getOpponentColor() {
    if(this.playerColor === "white") {
      return "black"
    }
    if(this.playerColor === "black") {
      return "white"
    }

    return ""
  }

  resign() {
    this.gameControlService.resign(this.playerId)
  }

  undoMove() {
    this.gameControlService.undoMove(this.playerId)
  }

  private subscribeToMoveUpdates() {
    this.gameEventsService.getPiecePositionUpdatedObservable().subscribe((update: PiecePositionUpdate) => {
      if (update.reverted) {
        this.lastMove = null
      } else {
        this.lastMove = { from: update.primaryMove.from, to: update.primaryMove.to }
      }

      const from = update.primaryMove.from
      const to = update.primaryMove.to

      // const piece = this.piecePositions[from] necessary?
      this.moveRequestInProgress = false // todo something better

      this.turn = update.turn
      //this.piecePositionChange.next(update)
    })
  }

  private subscribeToPossibleMoves() {
    this.gameControlService.getPossibleMovesSubscription().subscribe((possibleMoves: PossibleMoves) => {
      this.possibleMoves = possibleMoves
      this.possibleMovesUpdate.next(possibleMoves)
    })
  }

  private subscribteToGameStartEvent() {
    this.gameControlService.getGameStartedSubscription().subscribe((gameInfo: GameInfoMessage) => { // TODO unsubscribe?
      this.gameStarted(gameInfo)
    })
  }

  private subscribeToJoinedExistingGameEvent() {
    this.gameControlService.getJoinedExistingGameSubscription().subscribe((gameInfo: GameInfoMessage) => {
      this.gameStarted(gameInfo)
    })
  }

  private gameStarted(gameInfo: GameInfoMessage) {
    this.gameResult = null
    this.canPlayerMove = true
    this.gameMode = gameInfo.mode
  //  this.fieldOccupationChange.next(gameInfo.piecePositions)

    this.playerId = gameInfo.player.id
    this.playerColor = gameInfo.player.color
    this.turn = gameInfo.turn
    this.gameStartEvent.next({ playerColor: this.playerColor, recordedMoves: gameInfo.recordedMoves, captures: gameInfo.captures, score: gameInfo.score, piecePositions: gameInfo.piecePositions})
    if(gameInfo.result) {
      this.canPlayerMove = false
      this.gameResult = gameInfo.result
      this.gameFinishedEvent.next(gameInfo.result)
    }
  }

  private subscribeToWaitingForOtherPlayersEvent() {
    this.gameControlService.getWaitingForOtherPlayersSubscription().subscribe((gameId: string) => {
      this.waitingForPlayersEvent.next(gameId)
    })
  }

  private subscribeToGameFinishedEvent() {
    this.gameControlService.getGameResultSubscription().subscribe((gameResult: GameResultMessage) => {
      this.canPlayerMove = false
      this.gameResult = gameResult
      this.gameFinishedEvent.next(gameResult)
    })
  }
}

export enum MoveRequestResult {
  ACCEPTED, REJECTED, DEFERRED
}
