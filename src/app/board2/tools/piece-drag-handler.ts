import { FieldUtilsService } from "./field-utils.service";
import { PiecesLocations } from "./pieces-locations";
import { Point } from "./point.model";
import { BoardSetup } from "./board-setup";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { Piece } from "./piece.model";
import { GameService } from "src/app/services/game.service";

export class PieceDragHandler {

  private pieceDraggedFromField: string
  private draggedPiece?: Piece

  constructor(
    private fieldUtils: FieldUtilsService,
    private boardSetup: BoardSetup,
    private piecesLocations: PiecesLocations,
    private htmlPieceRenderer: HtmlPieceReneder,
    private gameService: GameService) { }

  notifyMouseDownEvent(p: Point, piece?: Piece) {
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
    // available moves requested form mark and move class, so for now not doing it again
    // fix that - do not rely on side effect caused by other class and do not fetch moves twice at the same time
    this.piecesLocations.delete(field)
    this.htmlPieceRenderer.renderPieceByCoursor(p.x, p.y, checkedPiece)
  }

  notifyMouseMove(p: Point) {
    if (this.draggedPiece) {
      this.htmlPieceRenderer.renderPieceByCoursor(p.x, p.y, this.draggedPiece)
    }
  }

  notifyMouseUpEvent(p: Point) {
    const field = this.fieldUtils.determineFieldAtPos(p, this.boardSetup.fieldSize)

    if (this.draggedPiece) {
      const moveSuccesful = field && this.gameService.requestMove(this.pieceDraggedFromField, field)

      if (!moveSuccesful) {
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