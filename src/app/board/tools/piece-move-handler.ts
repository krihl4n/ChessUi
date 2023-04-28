import { PiecesLocations } from "./pieces-locations";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { GameService } from "src/app/services/game.service";
import { PiecePositionUpdate } from "src/app/model/piece-position-update.model";
import { Subscription } from "rxjs";

export class PieceMoveHandler {

    private positionChangeSubscription: Subscription

    constructor(private piecesLocations: PiecesLocations, private htmlPieceRenderer: HtmlPieceReneder, private gameService: GameService) {

        this.positionChangeSubscription = this.gameService.piecePositionChange.subscribe((update: PiecePositionUpdate) => {
            console.log("***** MOVE HANDLER - POSITION UPDATE")
            if (update.reverted) {
                this.movePiece(update.primaryMove.to, update.primaryMove.from)
                if (update.pieceCapture) {
                    const piece = this.htmlPieceRenderer.renderPiece(
                        update.pieceCapture.capturedPiece.color,
                        update.pieceCapture.capturedPiece.type,
                        update.pieceCapture.field)
                    this.piecesLocations.set(update.pieceCapture.field, piece)
                }
            } else {
                if (update.pawnPromotion != null) {
                    this.movePieceAndPromote(update.primaryMove.from, update.primaryMove.to)
                } else {
                    this.movePiece(update.primaryMove.from, update.primaryMove.to)
                }

            }

            if (update.secondaryMove) { // castling
                if (update.reverted) {
                    this.movePiece(update.secondaryMove.to, update.secondaryMove.from)
                } else {
                    this.movePiece(update.secondaryMove.from, update.secondaryMove.to)
                }
            }

            if (update.pieceCapture && update.primaryMove.to != update.pieceCapture.field && !update.reverted) { // en passant
                const pieceAtDst = this.piecesLocations.get(update.pieceCapture.field)
                if (pieceAtDst) {
                    this.piecesLocations.delete(update.pieceCapture.field)
                    this.htmlPieceRenderer.deletePiece(pieceAtDst, update.pieceCapture.field)
                }
            }
        })
    }

    cleanup() {
        this.positionChangeSubscription.unsubscribe()
    }

    movePiece(from: string, to: string) {
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
        this.piecesLocations.delete(to)
        this.piecesLocations.set(to, piece)
    }

    movePieceAndPromote(from: string, to: string) {
        const piece = this.piecesLocations.get(from)
        if (!piece) {
            console.log("no piece at " + from)
            return
        }

        const pieceAtDst = this.piecesLocations.get(to)
        const newPiece = this.htmlPieceRenderer.renderPieceMovementWithPieceChange(to, piece)
        if (pieceAtDst) {
            this.htmlPieceRenderer.deletePiece(pieceAtDst, to)
        }
        this.piecesLocations.delete(from)
        this.piecesLocations.delete(to)
        this.piecesLocations.set(to, newPiece)
    }
}