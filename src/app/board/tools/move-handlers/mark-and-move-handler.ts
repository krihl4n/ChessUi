import { BoardSetup } from "../board-setup";
import { FieldUtilsService } from "../field-utils.service";
import { HtmlPieceReneder } from "../html-piece-renderer";
import { PiecesLocations } from "../pieces-locations";
import { Point } from "../point.model";
import { Piece } from "../piece.model";
import { GameService, MoveRequestResult } from "src/app/services/game.service";
import { Subscription } from "rxjs";
import { Promotion } from "../../pawn-promotion/promotion.model";

export class MarkAndMoveHandler { // todo maybe separate handlers for pieve movement and fields marking

    private markedField?: string
    private previouslyMarkedField?: string
    private promotionClosedSubscription: Subscription
    private possibleMovesUpdateSubscription: Subscription

    constructor(
        private fieldUtils: FieldUtilsService,
        private boardSetup: BoardSetup,
        private piecesLocations: PiecesLocations,
        private renderer: HtmlPieceReneder,
        private gameService: GameService) {

        this.promotionClosedSubscription = this.gameService.getPromotionClosedObservable().subscribe((promotion?: Promotion) => {
            console.log("***** M & M PROMOTION CLOSED")
            this.markedField = undefined // todo extract field marking
            this.previouslyMarkedField = undefined

            if (promotion) {
                const piece = this.piecesLocations.get(promotion.from)
                if (!piece) {
                    console.log("no piece at " + promotion.from)
                    return
                }

                const pieceAtDst = this.piecesLocations.get(promotion.to)
                if (pieceAtDst) {
                    this.renderer.deletePiece(pieceAtDst, promotion.to)
                }

                const newPiece = this.renderer.renderPieceMovementWithPieceChange(promotion.to, piece, promotion.promotion)
                this.piecesLocations.delete(promotion.from)
                this.piecesLocations.set(promotion.to, newPiece)
            }
        })
    }

    cleanup() {
        this.promotionClosedSubscription?.unsubscribe()
        this.possibleMovesUpdateSubscription?.unsubscribe()
    }

    notifyMouseDownEvent(point: Point) {
        if (!this.gameService.canMove()) {
            return
        }

        this.previouslyMarkedField = this.markedField
        const field = this.fieldUtils.determineFieldAtPos(point, this.boardSetup.fieldSize)
        if (!field) {
            return
        }

        const piece = this.piecesLocations.get(field)
        if (piece && this.gameService.canMove(piece.color)) {
            this.markField(field)
        }
    }

    notifyMouseUpEvent(point: Point) {
        if (!this.gameService.canMove()) {
            return
        }

        console.log("***** M & M MOUSE UP")
        const field = this.fieldUtils.determineFieldAtPos(point, this.boardSetup.fieldSize)
        if (field && this.previouslyMarkedField && field != this.previouslyMarkedField) {
            const pieceToMove = this.piecesLocations.get(this.previouslyMarkedField)
            if (pieceToMove && this.gameService.canMove(pieceToMove.color)) {
                const pieceAtDst = this.piecesLocations.get(field)
                if (!pieceAtDst || pieceAtDst.color != pieceToMove.color) {
                    this.tryToMovePiece(this.previouslyMarkedField, field, pieceToMove)
                }
            }
        }
        if (field && field == this.markedField) {
            if (this.previouslyMarkedField != field) {

            } else {
                this.previouslyMarkedField = this.markedField
                this.markedField = undefined
            }
        } else {
            this.previouslyMarkedField = this.markedField
            this.markedField = undefined
        }
    }

    fieldIsMarked(field: string) {
        return this.markedField == field
    }

    fieldIsMarkedForPossibleMove(field: string): boolean {
        let possibleMoves = this.gameService.getPossibleMoves()
        if(!possibleMoves) {
            return false
        }
        if (possibleMoves.from == this.markedField) {
            return possibleMoves.to.includes(field)
        }
        return false
    }

    private markField(field: string) {
        this.markedField = field
        this.gameService.initiateMoveFrom(field)
    }

    private tryToMovePiece(from: string, to: string, piece: Piece) {
        if (this.gameService.requestMove(from, to) === MoveRequestResult.ACCEPTED) {
            this.piecesLocations.delete(from)
            this.renderer.renderPieceMovement(to, piece)
            let pieceAtDst = this.piecesLocations.get(to)
            if (pieceAtDst) {
                this.renderer.deletePiece(pieceAtDst, to)
            }
            this.piecesLocations.set(to, piece)
        }
    }
}