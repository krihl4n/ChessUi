import { FieldUtilsService } from "./field-utils.service";
import { PiecesLocations } from "./pieces-locations";
import { Point } from "./point.model";
import { BoardSetup } from "./board-setup";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { Piece } from "./piece.model";

export class PieceDragHandler {

    private pieceDraggedFromField: string
    private draggedPiece: Piece | null
    private pieceMovementListener: any

    constructor(
        private fieldUtils: FieldUtilsService, 
        private boardSetup: BoardSetup, 
        private piecesLocations: PiecesLocations, 
        private htmlPieceRenderer: HtmlPieceReneder) {}


    registerPieceMovementListener(l: any) {
        this.pieceMovementListener = l
    }
        
    notifyMouseDownLeftClickEvent(p: Point) {
        const field = this.fieldUtils.determineFieldAtPos(p, this.boardSetup.fieldSize)
        if(!field) {
            return
        }
        const piece = this.piecesLocations.get(field)
        if(!piece) {
            return
        }

        this.pieceDraggedFromField = field
        this.draggedPiece = piece
        this.piecesLocations.delete(field)
        this.htmlPieceRenderer.renderPieceByCoursor(p.x, p.y, piece)
    }

    notifyMouseDownOnPieceEvent(p: Point, piece: Piece | null = null) {
        const field = this.fieldUtils.determineFieldAtPos(p, this.boardSetup.fieldSize)
        if(!field) {
            return
        }
        const checkedPiece = piece || this.piecesLocations.get(field)
        if(!checkedPiece) {
            return
        }
        this.pieceDraggedFromField = field
        this.draggedPiece = checkedPiece
        this.piecesLocations.delete(field)
        this.htmlPieceRenderer.renderPieceByCoursor(p.x, p.y, checkedPiece)
    }

    notifyMouseMove(p: Point) {
      if(this.draggedPiece) {
       this.htmlPieceRenderer.renderPieceByCoursor(p.x, p.y, this.draggedPiece)
      }
    }

    notifyMouseUpEvent(p: Point) {
        const field = this.fieldUtils.determineFieldAtPos(p, this.boardSetup.fieldSize)

      if(this.draggedPiece) {
        if(!field) {
          this.piecesLocations.set(this.pieceDraggedFromField, this.draggedPiece)
          this.htmlPieceRenderer.renderPieceAtField(this.pieceDraggedFromField, this.draggedPiece)
        } else {
          this.piecesLocations.set(field, this.draggedPiece)
          this.htmlPieceRenderer.renderPieceAtField(field, this.draggedPiece)
          if(field != this.pieceDraggedFromField) {
            this.pieceMovementListener()
          }
        }

        this.draggedPiece = null
      }
    }
}