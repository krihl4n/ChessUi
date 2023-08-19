import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameInfo } from '../model/game-info.model';
import { GameResult } from '../model/game-result.model';
import { GameStartEvent } from '../model/game-start-event.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { PossibleMoves } from '../model/possible-moves.model';
import { GameControlService } from './game-control.service';
import { Move } from '../model/move.model'
import { PawnPromotionService } from '../board/pawn-promotion/pawn-promotion.service';
import { Promotion } from '../board/pawn-promotion/promotion.model';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {

  private piecePositions: FieldOccupation[] // necessary?
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

  private fieldOccupationChange: Subject<FieldOccupation[]> = new Subject()
  private piecePositionChange: Subject<PiecePositionUpdate> = new Subject()
  private gameStartEvent: Subject<GameStartEvent> = new Subject()
  private waitingForPlayersEvent: Subject<string> = new Subject()
  private rematchRequestedEvent: Subject<string> = new Subject()
  private possibleMovesUpdate: Subject<PossibleMoves> = new Subject()
  private pawnPromotionClosed: Subject<Promotion | null> = new Subject()

  private promotionClosedSubscription: Subscription

  constructor(private gameControlService: GameControlService, private pawnPromotionService: PawnPromotionService) {
    this.subscribeToMoveUpdates();
    this.subscribeToPossibleMoves();
    this.subscribteToGameStartEvent();
    this.subscribeToWaitingForOtherPlayersEvent();
    this.subscribeToJoinedExistingGameEvent();
    this.subscribeToGameFinishedEvent();
    this.subscribeToRematchRequestedEvent();

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

  getFieldOccupationChangeObservable() {
    return this.fieldOccupationChange.asObservable();
  }

  getPiecePositionChangeObservable() {
    return this.piecePositionChange.asObservable()
  }

  getGameStartedEventObservable() {
    return this.gameStartEvent.asObservable()
  }

  getWaitinForPlayersObservable() {
    return this.waitingForPlayersEvent.asObservable()
  }

  getRematchRequestedObservable() {
    return this.rematchRequestedEvent.asObservable()
  }

  getPossibleMovesUpdateObservable() {
    return this.possibleMovesUpdate.asObservable()
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
    this.gameControlService.piecePositionUpdate().subscribe((update: PiecePositionUpdate) => {
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
      this.piecePositionChange.next(update)
    })
  }

  private subscribeToPossibleMoves() {
    this.gameControlService.getPossibleMovesSubscription().subscribe((possibleMoves: PossibleMoves) => {
      this.possibleMoves = possibleMoves
      this.possibleMovesUpdate.next(possibleMoves)
    })
  }

  private subscribteToGameStartEvent() {
    this.gameControlService.getGameStartedSubscription().subscribe((gameInfo: GameInfo) => { // TODO unsubscribe?
      this.gameStarted(gameInfo)
    })
  }

  private subscribeToJoinedExistingGameEvent() {
    this.gameControlService.getJoinedExistingGameSubscription().subscribe((gameInfo: GameInfo) => {
      this.gameStarted(gameInfo)
    })
  }

  private gameStarted(gameInfo: GameInfo) {
    this.canPlayerMove = true
    this.gameMode = gameInfo.mode

    if (this.piecePositions != gameInfo.piecePositions) {
      this.fieldOccupationChange.next(gameInfo.piecePositions)
      this.piecePositions = gameInfo.piecePositions
    }

    this.playerId = gameInfo.player.id
    this.playerColor = gameInfo.player.color
    this.turn = gameInfo.turn
    this.gameStartEvent.next({ playerColor: this.playerColor, recordedMoves: gameInfo.recordedMoves, captures: gameInfo.captures, score: gameInfo.score})
  }

  private subscribeToWaitingForOtherPlayersEvent() {
    this.gameControlService.getWaitingForOtherPlayersSubscription().subscribe((gameId: string) => {
      this.waitingForPlayersEvent.next(gameId)
    })
  }

  private subscribeToRematchRequestedEvent() {
    this.gameControlService.getRematchRequestedSubscription().subscribe((gameId: string) => {
      this.rematchRequestedEvent.next(gameId)
    })
  }

  private subscribeToGameFinishedEvent() {
    this.gameControlService.getGameResultSubscription().subscribe((gameResult: GameResult) => {
      this.canPlayerMove = false
      this.gameResult = gameResult
    })
  }
}

export enum MoveRequestResult {
  ACCEPTED, REJECTED, DEFERRED
}
