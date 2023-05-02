import { FieldUtilsService } from "../field-utils.service";
import { PiecesLocations } from "../pieces-locations";
import { Point } from "../point.model";
import { BoardSetup } from "../board-setup";
import { HtmlPieceReneder } from "../html-piece-renderer";
import { Piece } from "../piece.model";
import { GameService, MoveRequestResult } from "src/app/services/game.service";
import { Subscription } from "rxjs";

export class PieceDragHandler {

  private pieceDraggedFromField: string
  private draggedPiece?: Piece
  private promotionClosedSubscription: Subscription
  private moveDeferredPiece?: Piece

  constructor(
    private fieldUtils: FieldUtilsService,
    private boardSetup: BoardSetup,
    private piecesLocations: PiecesLocations,
    private htmlPieceRenderer: HtmlPieceReneder,
    private gameService: GameService) {

    this.promotionClosedSubscription = this.gameService.getPromotionClosedObservable().subscribe((promotion: { promotion: string, from: string, to: string }) => {

      console.log("***** D & D PROMOTION CLOSED")

      if(this.moveDeferredPiece) {
        const newPiece = this.htmlPieceRenderer.renderPieceChange(promotion.to, this.moveDeferredPiece)
        this.piecesLocations.set(promotion.to, newPiece)
        this.moveDeferredPiece = undefined
      }
    })
  }

  cleanup() {
    this.promotionClosedSubscription?.unsubscribe();
  }

  notifyMouseDownEvent(p: Point, piece?: Piece) {
    if (!this.gameService.canMove(piece?.color)) {
      return
    }

    const field = this.fieldUtils.determineFieldAtPos(p, this.boardSetup.fieldSize)
    if (!field) {
      return
    }
    const checkedPiece = piece || this.piecesLocations.get(field)
    if (!checkedPiece || !this.gameService.canMove(checkedPiece.color)) {
      return
    }
    this.pieceDraggedFromField = field
    this.draggedPiece = checkedPiece
    // available moves requested form mark and move class, so for now not doing it again
    // fix that - do not rely on side effect caused by other class and do not fetch moves twice at the same time
    //this.piecesLocations.delete(field) // moved to notifyMouseUpEvent - fixes issue with drag and drop to piece promotion
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
      const moveSuccesful = field && this.gameService.requestMove(this.pieceDraggedFromField, field) === MoveRequestResult.ACCEPTED
      const moveDeferred = field && this.gameService.requestMove(this.pieceDraggedFromField, field) === MoveRequestResult.DEFERRED

      if (moveDeferred) {
        console.log("MOVE DEFERRED") // todo attack
        const pieceAtDst = this.piecesLocations.get(field)
        if(pieceAtDst) {
          this.htmlPieceRenderer.deletePieceNow(pieceAtDst)
        }
        this.piecesLocations.delete(this.pieceDraggedFromField)
        this.htmlPieceRenderer.renderPieceAtField(field, this.draggedPiece)
        this.moveDeferredPiece = this.draggedPiece
      } else if (!moveSuccesful) {
        this.piecesLocations.set(this.pieceDraggedFromField, this.draggedPiece)
        this.htmlPieceRenderer.renderPieceAtField(this.pieceDraggedFromField, this.draggedPiece)
      } else {
        this.piecesLocations.delete(this.pieceDraggedFromField)
        let pieceAtDst = this.piecesLocations.get(field)
        if (pieceAtDst) {
          this.piecesLocations.delete(field)
          this.htmlPieceRenderer.deletePieceNow(pieceAtDst)
        }
        this.piecesLocations.set(field, this.draggedPiece)
        this.htmlPieceRenderer.renderPieceAtField(field, this.draggedPiece)
      }

      this.draggedPiece = undefined
    }
  }
}