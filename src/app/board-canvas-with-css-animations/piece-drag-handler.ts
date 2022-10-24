import { FieldUtilsService } from "../board-canvas/field-utils.service";
import { PiecesLocations } from "../board-canvas/pieces-locations";
import { BoardSetup } from "./board-setup";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { Piece } from "./piece.model";

export class PieceDragHandler {

    private pieceDraggedFromField: string
    private draggedPiece: Piece | null

    constructor(
        private fieldUtils: FieldUtilsService, 
        private boardSetup: BoardSetup, 
        private piecesLocations: PiecesLocations, 
        private htmlPieceRenderer: HtmlPieceReneder) {}

    notifyMouseDownLeftClickEvent(xOnBoard: number, yOnBoard: number, absoluteX: number, absoluteY: number) {
        const field = this.fieldUtils.determineFieldAtPos(xOnBoard, yOnBoard, this.boardSetup.fieldSize)
        const piece = this.piecesLocations.get(field)
        if(!piece) {
            return
        }

        this.pieceDraggedFromField = field
        this.draggedPiece = piece
        this.piecesLocations.delete(field)
        this.htmlPieceRenderer.renderDraggedPiece(absoluteX, absoluteY, this.draggedPiece)
    }

    notifyMouseMove(absoluteX: number, absoluteY: number) {
      if(this.draggedPiece) {
        this.htmlPieceRenderer.renderDraggedPiece(absoluteX, absoluteY, this.draggedPiece)
      }
    }

    notifyMouseUpEvent(xOnBoard: number, yOnBoard: number) {
        const field = this.fieldUtils.nullableDetermineFieldAtPos(xOnBoard, yOnBoard, this.boardSetup.fieldSize)

      if(this.draggedPiece) {
        if(!field) {
          this.piecesLocations.set(this.pieceDraggedFromField, this.draggedPiece)
        } else {
          this.piecesLocations.set(field, this.draggedPiece)
        }
        this.draggedPiece = null
        this.htmlPieceRenderer.clearDraggedPiece()
      }
    }

    initiatePieceDragMovement(startField: string, piece: Piece) {

    }

    updatePiecePosition() {

    }

    finishPieceDragMovement() {

    }
}