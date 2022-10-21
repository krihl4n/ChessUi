import { Renderer2 } from "@angular/core";
import { FieldUtilsService } from "../board-canvas/field-utils.service";

export class HtmlPieceReneder {
    constructor(
        private renderer: Renderer2, 
        private fieldUtils: FieldUtilsService, 
        private boardNativeElement: any,
        private fieldSize: number) {}

    renderPieceMovement(from: string, to: string, piece: Piece) {
      const pieceImageElement = this.renderer.createElement('img');
      this.renderer.setAttribute(pieceImageElement, 'src', `assets/${piece.color}_${piece.type}.svg`)
      this.renderer.setAttribute(pieceImageElement, 'draggable', 'false')

      this.setRenderedLocation(pieceImageElement, this.getPieceLocation(from))
      this.renderer.appendChild(this.boardNativeElement, pieceImageElement)
      setTimeout(() => {
        this.setRenderedLocation(pieceImageElement, this.getPieceLocation(to))
      }, 1)

      // remove when canvas part is ready
    }

    renderPiece() {
        const pieceImageElement = this.renderer.createElement('img');
        this.renderer.setAttribute(pieceImageElement, 'src', "assets/white_bishop.svg")
        this.renderer.setAttribute(pieceImageElement, 'draggable', 'false')
        
        setTimeout(() => {
          this.setRenderedLocation(pieceImageElement, this.getPieceLocation("b3"))
          this.renderer.appendChild(this.boardNativeElement, pieceImageElement)
        }, 1000)
    
        setTimeout(() => {
          this.setRenderedLocation(pieceImageElement, this.getPieceLocation("h3"))
        }, 2000)
    
        setTimeout(() => {
          this.renderer.removeChild(this.boardNativeElement, pieceImageElement)
        }, 4000)
    }

    private setRenderedLocation(pieceImageElement: any, pieceLocation: {x: number, y: number}) {
        this.renderer.setStyle(pieceImageElement, 'left', pieceLocation.x + 'px')
        this.renderer.setStyle(pieceImageElement, 'top', pieceLocation.y + 'px')
    }

    private getPieceLocation(field: string) {
        return this.fieldUtils.determinePieceLocationAtField(field, this.fieldSize) 
    }
}

export class Piece {
  color: string
  type: string
}