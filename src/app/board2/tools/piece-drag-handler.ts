import { FieldUtilsService } from "./field-utils.service";
import { PiecesLocations } from "./pieces-locations";
import { Point } from "./point.model";
import { BoardSetup } from "./board-setup";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { Piece } from "./piece.model";

export class PieceDragHandler {

  private pieceDraggedFromField: string
  private draggedPiece?: Piece
  private mouseUpEventTime: number

  constructor(
    private fieldUtils: FieldUtilsService,
    private boardSetup: BoardSetup,
    private piecesLocations: PiecesLocations,
    private htmlPieceRenderer: HtmlPieceReneder) { }

  notifyMouseDownEvent(p: Point, piece?: Piece) {
    const delay = 75
    setTimeout(() => {
      if (Date.now() - this.mouseUpEventTime > delay) {
        const field = this.fieldUtils.determineFieldAtPos(p, this.boardSetup.fieldSize)
        if (!field) {
          return
        }
        const checkedPiece = piece || this.piecesLocations.get(field)
        if (!checkedPiece) {
          return
        }
        this.pieceDraggedFromField = field
        this.draggedPiece = checkedPiece
        this.piecesLocations.delete(field)
        this.htmlPieceRenderer.renderPieceByCoursor(p.x, p.y, checkedPiece)
      }
    }, delay)
  }

  notifyMouseMove(p: Point) {
    if (this.draggedPiece) {
      this.htmlPieceRenderer.renderPieceByCoursor(p.x, p.y, this.draggedPiece)
    }
  }

  notifyMouseUpEvent(p: Point) {
    this.mouseUpEventTime = Date.now()
    const field = this.fieldUtils.determineFieldAtPos(p, this.boardSetup.fieldSize)

    if (this.draggedPiece) {
      if (!field) {
        this.piecesLocations.set(this.pieceDraggedFromField, this.draggedPiece)
        this.htmlPieceRenderer.renderPieceAtField(this.pieceDraggedFromField, this.draggedPiece)
      } else {
        this.piecesLocations.set(field, this.draggedPiece)
        this.htmlPieceRenderer.renderPieceAtField(field, this.draggedPiece)
      }

      this.draggedPiece = undefined
    }
  }
}