import { PiecesLocations } from "../pieces-locations";
import { HtmlPieceReneder } from "../html-piece-renderer";
import { Subscription } from "rxjs";
import { PiecePositionUpdateMessage } from "src/app/model/messages";
import { GameEventsService } from "src/app/services/game-events.service";

export class AsyncMoveHandler {

    private positionChangeSubscription: Subscription

    constructor(private piecesLocations: PiecesLocations, private htmlPieceRenderer: HtmlPieceReneder, private gameEventsService: GameEventsService) {
        this.positionChangeSubscription = this.gameEventsService.getPiecePositionUpdatedObservable()
            .subscribe((update: PiecePositionUpdateMessage) => {
                console.log("***** M&M HANDLER - POSITION UPDATE")
                if (!update.reverted) {
                    this.handlePiecePositionUpdate(update)
                } else {
                    this.handleRevertedPiecePositionUpdate(update)
                }
            })
    }

    cleanup() {
        this.positionChangeSubscription?.unsubscribe()
    }

    private handlePiecePositionUpdate(update: PiecePositionUpdateMessage) {
        if (update.pawnPromotion != null) {
            this.moveAndChangePiece(update.primaryMove.from, update.primaryMove.to, update.pawnPromotion)
        } else {
            this.movePiece(update.primaryMove.from, update.primaryMove.to)
        }

        if (update.secondaryMove) {
            this.movePiece(update.secondaryMove.from, update.secondaryMove.to)
        }

        if (update.pieceCapture && this.isEnPassantAttack(update)) {
            const pieceAtDst = this.piecesLocations.get(update.pieceCapture.field) // todo also handle en passant in m&m and d&d handlers?
            if (pieceAtDst) {
                this.piecesLocations.delete(update.pieceCapture.field)
                this.htmlPieceRenderer.deletePiece(pieceAtDst, update.pieceCapture.field)
            }
        }
    }

    private handleRevertedPiecePositionUpdate(update: PiecePositionUpdateMessage) {
        if (update.pawnPromotion) {
            this.changeAndMovePiece(update.primaryMove.to, update.primaryMove.from)
        } else {
            this.movePiece(update.primaryMove.to, update.primaryMove.from)
        }

        if (update.pieceCapture) {
            const piece = this.htmlPieceRenderer.renderPiece(
                update.pieceCapture.capturedPiece.color,
                update.pieceCapture.capturedPiece.type,
                update.pieceCapture.field)
            this.piecesLocations.set(update.pieceCapture.field, piece)
        }

        if (update.secondaryMove) {
            this.movePiece(update.secondaryMove.to, update.secondaryMove.from)
        }
    }

    private isEnPassantAttack(update: PiecePositionUpdateMessage) {
        return update.pieceCapture && update.primaryMove.to != update.pieceCapture.field
    }

    private movePiece(from: string, to: string) {
        const piece = this.piecesLocations.get(from)
        if (!piece) {
            console.log("no piece at " + from)
            return
        }

        const pieceAtDst = this.piecesLocations.get(to)
        this.htmlPieceRenderer.renderPieceMovement(to, piece)
        if (pieceAtDst) {
            this.htmlPieceRenderer.deletePiece(pieceAtDst, to)
        }
        this.piecesLocations.delete(from)
        this.piecesLocations.set(to, piece)
    }

    private moveAndChangePiece(from: string, to: string, promotion: string) {
        const piece = this.piecesLocations.get(from)
        if (!piece) {
            console.log("no piece at " + from)
            return
        }

        const pieceAtDst = this.piecesLocations.get(to)
        const newPiece = this.htmlPieceRenderer.renderPieceMovementWithPieceChange(to, piece, promotion.toLowerCase()) // todo commonize casing?
        if (pieceAtDst) {
            this.htmlPieceRenderer.deletePiece(pieceAtDst, to)
        }
        this.piecesLocations.delete(from)
        this.piecesLocations.set(to, newPiece)
    }

    private changeAndMovePiece(from: string, to: string) {
        const piece = this.piecesLocations.get(from)
        if (!piece) {
            console.log("no piece at " + from)
            return
        }

        const newPiece = this.htmlPieceRenderer.renderPieceChangeWithPieceMovement(from, to, piece)
        this.piecesLocations.delete(from)
        this.piecesLocations.set(to, newPiece)
    }
}