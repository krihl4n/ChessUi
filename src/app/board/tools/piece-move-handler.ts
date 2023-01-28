import { PiecesLocations } from "./pieces-locations";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { GameService } from "src/app/services/game.service";
import { PiecePositionUpdate } from "src/app/model/piece-position-update.model";

export class PieceMoveHandler {

    constructor(private piecesLocations: PiecesLocations, private htmlPieceRenderer: HtmlPieceReneder, private gameService: GameService) {
        // TODO undo attacks
        this.gameService.piecePositionChange.subscribe((update: PiecePositionUpdate) => {
            if (update.reverted) {
                this.movePiece(update.primaryMove.to, update.primaryMove.from)
            } else {
                this.movePiece(update.primaryMove.from, update.primaryMove.to)
            }

            if (update.secondaryMove) { // castling
                if (update.reverted) {
                    this.movePiece(update.secondaryMove.to, update.secondaryMove.from)
                } else {
                    this.movePiece(update.secondaryMove.from, update.secondaryMove.to)
                }
            }

            if (update.pieceCapture && update.primaryMove.to != update.pieceCapture.field) { // en passant
                const pieceAtDst = this.piecesLocations.get(update.pieceCapture.field)
                if (pieceAtDst) {
                    this.piecesLocations.delete(update.pieceCapture.field)
                    this.htmlPieceRenderer.deletePiece(pieceAtDst, update.pieceCapture.field)
                }
            }
        })
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
}