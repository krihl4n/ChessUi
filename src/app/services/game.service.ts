import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GameControlService } from './game-control.service';
import { PawnPromotionService } from '../board/pawn-promotion/pawn-promotion.service';
import { Promotion } from '../board/pawn-promotion/promotion.model';
import { GameInfoMessage, GameResultMessage, PiecePositionUpdateMessage } from '../model/messages';
import { GameResult, GameFinishedEvent, GameStartEvent, Move, PossibleMoves, Color } from '../model/typings';
import { GameEventsService } from './game-events.service';
import { GameInfoService } from './game-info.service';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {

  private moveRequestInProgress: boolean = false
  private possibleMoves?: PossibleMoves
  private canPlayerMove: boolean = false
  private turn = ""
  public gameResult?: GameResult
  public colorPreference?: Color
  public lastMove?: Move // for field marking. doesn't work after refresh. send form BE?

  private gameStartEvent: Subject<GameStartEvent> = new Subject()
  private gameFinishedEvent: Subject<GameFinishedEvent> = new Subject()

  private pawnPromotionClosed: Subject<Promotion | undefined> = new Subject()
  private promotionClosedSubscription: Subscription

  constructor(private gameControlService: GameControlService, private gameEventsService: GameEventsService, private pawnPromotionService: PawnPromotionService, private gameInfoService: GameInfoService) {
    this.subscribeToMoveUpdates();
    this.subscribeToPossibleMoves();
    this.subscribteToGameStartEvent();
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

  getPossibleMoves() {
    return this.possibleMoves
  }

  getGameFinishedObservable() {
    return this.gameFinishedEvent.asObservable()
  }

  initiateNewGame(mode: string, pieceSetup: string, colorPreference?: Color) {
    this.colorPreference = colorPreference
    this.gameControlService.initiateNewGame(mode, pieceSetup) // color preference here?
  }

  joinExistingGame(gameId: string) {
    this.gameControlService.joinExistingGame(gameId, this.colorPreference)
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
    this.gameControlService.moveRequest(from, to, pawnPromotion) // TODO what happens if move fails on the backend side?
    return true
  }

  requestMove(from: string, to: string): MoveRequestResult {

    if (this.moveRequestInProgress) {
      return MoveRequestResult.REJECTED
    }

    if (this.possibleMoves?.from == from && this.possibleMoves.to.includes(to)) {
      if (this.pawnPromotionService.shouldOpenPromotionChoice(from, to, this.gameInfoService.getPlayerColor())) {
        this.pawnPromotionService.display(from, to)
        this.canPlayerMove = false
        return MoveRequestResult.DEFERRED
      }

      this.moveRequestInProgress = true
      this.gameControlService.moveRequest(from, to) // TODO what happens if move fails on the backend side?
      return MoveRequestResult.ACCEPTED
    }
    return MoveRequestResult.REJECTED;
  }

  canMove(color?: string) {
    if (color && !this.gameInfoService.isTestMode()) {
      return this.canPlayerMove && this.gameInfoService.isCurrentPlayer(color) && this.turn == color
      //return this.canPlayerMove && color.toLowerCase() == this.gameInfoService.getPlayerColor().toLowerCase() && this.turn == this.gameInfoService.getPlayerColor()
    }
    return this.canPlayerMove
  }

  getTurn() {
    return this.turn
  }

  resign() {
    this.gameControlService.resign()
  }

  undoMove() {
    this.gameControlService.undoMove()
  }

  private subscribeToMoveUpdates() {
    this.gameEventsService.getPiecePositionUpdatedObservable().subscribe((update: PiecePositionUpdateMessage) => {
      if (update.reverted) {
        this.lastMove = undefined
      } else {
        this.lastMove = { from: update.primaryMove.from, to: update.primaryMove.to }
      }

      const from = update.primaryMove.from
      const to = update.primaryMove.to
      this.moveRequestInProgress = false // todo something better
      this.turn = update.turn
    })
  }

  private subscribeToPossibleMoves() {
    this.gameEventsService.getPossibleMovesObservable().subscribe((possibleMoves: PossibleMoves) => {
      this.possibleMoves = possibleMoves
    })
  }

  private subscribteToGameStartEvent() {
    this.gameEventsService.getGameStartedObservable().subscribe((gameInfo: GameInfoMessage) => { // TODO unsubscribe?
      this.gameStarted(gameInfo)
    })
  }

  private subscribeToJoinedExistingGameEvent() {
    this.gameEventsService.getJoinedExistingGameObservable().subscribe((gameInfo: GameInfoMessage) => {
      this.gameStarted(gameInfo)
    })
  }

  private gameStarted(gameInfo: GameInfoMessage) {
    this.gameResult = undefined
    this.lastMove = undefined
    this.canPlayerMove = true
    this.turn = gameInfo.turn
    this.gameStartEvent.next({ playerColor: gameInfo.player.color, recordedMoves: gameInfo.recordedMoves, captures: gameInfo.captures, score: gameInfo.score, piecePositions: gameInfo.piecePositions})
    if(gameInfo.result) {
      this.canPlayerMove = false
      this.gameResult = gameInfo.result
      this.gameFinishedEvent.next({ gameResult: gameInfo.result} )
    }
  }

  private subscribeToGameFinishedEvent() {
    this.gameEventsService.getGameFinishedObservable().subscribe((gameResult: GameResultMessage) => {
      this.canPlayerMove = false
      this.gameResult = gameResult
      this.gameFinishedEvent.next({ gameResult: gameResult} )
    })
  }
}

export enum MoveRequestResult {
  ACCEPTED, REJECTED, DEFERRED
}
