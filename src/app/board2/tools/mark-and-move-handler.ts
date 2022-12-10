import { BoardSetup } from "./board-setup";
import { FieldUtilsService } from "./field-utils.service";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { PiecesLocations } from "./pieces-locations";
import { Point } from "./point.model";
import { Piece } from "./piece.model";
import { GameService } from "src/app/services/game.service";

export class MarkAndMoveHandler { // todo maybe separate handlers for pieve movement and fields marking

    private markedField?: string
    private previouslyMarkedField?: string

    constructor(
        private fieldUtils: FieldUtilsService,
        private boardSetup: BoardSetup,
        private piecesLocations: PiecesLocations,
        private renderer: HtmlPieceReneder,
        private gameService: GameService) { }

    notifyMouseDownEvent(point: Point) {
        if(!this.gameService.canMove()) {
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
        if(!this.gameService.canMove()) {
            return
        }
        
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

    private markField(field: string) {
        this.markedField = field
        this.gameService.initiateMoveFrom(field)
    }

    private tryToMovePiece(from: string, to: string, piece: Piece) {
        if(this.gameService.requestMove(from, to)){
            this.piecesLocations.delete(from)
            this.renderer.renderPieceMovement(to, piece)
            let pieceAtDst = this.piecesLocations.get(to)
            if(pieceAtDst) {
                this.renderer.deletePiece(pieceAtDst, to)
            }
            this.piecesLocations.set(to, piece)
        }
    }
}