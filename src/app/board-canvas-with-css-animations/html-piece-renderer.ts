import { Renderer2 } from "@angular/core";
import { FieldUtilsService } from "../board-canvas/field-utils.service";
import { Piece } from "./piece.model";

export class HtmlPieceReneder {
    constructor(
        private renderer: Renderer2, 
        private fieldUtils: FieldUtilsService, 
        private boardNativeElement: any,
        private fieldSize: number) {}


    private pieceImageElement: any
    renderDraggedPiece(mouseX: number, mouseY: number, piece: Piece) {

      if(!this.pieceImageElement) {
        this.pieceImageElement = this.renderer.createElement('img');
        this.renderer.setAttribute(this.pieceImageElement, 'src', piece.imagePath)
        this.renderer.setAttribute(this.pieceImageElement, 'draggable', 'false')

        this.setRenderedLocation(this.pieceImageElement, {x: mouseX - 28, y: mouseY - 35}) // todo tune to piece size
        this.renderer.appendChild(window.document.body, this.pieceImageElement)
      } else {
        this.setRenderedLocation(this.pieceImageElement, {x: mouseX - 28, y: mouseY - 35})
      }
    }  

    clearDraggedPiece() {
      this.renderer.removeChild(window.document.body, this.pieceImageElement)
      this.pieceImageElement = null
    }

    renderPieceMovement(from: string, to: string, piece: Piece | undefined, moveFinished: (piece: Piece) => void) {
      if(!piece) {
        return
      }

      const pieceImageElement = this.renderer.createElement('img');
      this.renderer.setAttribute(pieceImageElement, 'src', piece.imagePath)
      this.renderer.setAttribute(pieceImageElement, 'draggable', 'false')
      this.renderer.setStyle(pieceImageElement, "transition", "all 500ms ease")
      this.setRenderedLocation(pieceImageElement, this.getPieceLocation(from))
      this.renderer.appendChild(this.boardNativeElement, pieceImageElement)
      setTimeout(() => {
        this.setRenderedLocation(pieceImageElement, this.getPieceLocation(to))
      }, 100)

      setTimeout(() => {
        this.renderer.removeChild(this.boardNativeElement, pieceImageElement)
        moveFinished(piece)
      }, 600)
    }

    private setRenderedLocation(pieceImageElement: any, pieceLocation: {x: number, y: number}) {
        this.renderer.setStyle(pieceImageElement, 'left', pieceLocation.x + 'px')
        this.renderer.setStyle(pieceImageElement, 'top', pieceLocation.y + 'px')
    }

    private getPieceLocation(field: string) {
        return this.fieldUtils.determinePieceLocationAtField(field, this.fieldSize) 
    }
}
