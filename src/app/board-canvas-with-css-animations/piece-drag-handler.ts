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

    notifyMouseDownLeftClickEvent(xOnBoard: number, yOnBoard: number) {
        const field = this.fieldUtils.determineFieldAtPos(xOnBoard, yOnBoard, this.boardSetup.fieldSize)
        const piece = this.piecesLocations.get(field)
        if(!piece) {
            return
        }

        this.pieceDraggedFromField = field
        this.draggedPiece = piece
        this.piecesLocations.delete(field)
        console.log('debug location ' + xOnBoard + " " + yOnBoard)
        this.htmlPieceRenderer.renderPieceByCoursor(xOnBoard, yOnBoard, piece)
    }

    notifyMouseDownOnPieceEvent(xOnBoard: number, yOnBoard: number, piece: Piece) {
        const field = this.fieldUtils.determineFieldAtPos(xOnBoard, yOnBoard, this.boardSetup.fieldSize)
        this.pieceDraggedFromField = field
        this.draggedPiece = piece
        this.piecesLocations.delete(field)
        this.htmlPieceRenderer.renderPieceByCoursor(xOnBoard, yOnBoard, piece)
    }

    notifyMouseMove(xOnBoard: number, yOnBoard: number) {
      if(this.draggedPiece) {
        console.log(xOnBoard + " " + yOnBoard)
       this.htmlPieceRenderer.renderPieceByCoursor(xOnBoard, yOnBoard, this.draggedPiece)
      }
    }

    notifyMouseUpEvent(xOnBoard: number, yOnBoard: number) {
        const field = this.fieldUtils.nullableDetermineFieldAtPos(xOnBoard, yOnBoard, this.boardSetup.fieldSize)

      if(this.draggedPiece) {
        if(!field) {
          this.piecesLocations.set(this.pieceDraggedFromField, this.draggedPiece)
          this.htmlPieceRenderer.renderPieceAtField(this.pieceDraggedFromField, this.draggedPiece)
        } else {
          this.piecesLocations.set(field, this.draggedPiece)
          this.htmlPieceRenderer.renderPieceAtField(field, this.draggedPiece)
        }

        this.draggedPiece = null
      }
    }
}