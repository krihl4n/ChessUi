import { Renderer2 } from "@angular/core";
import { FieldUtilsService } from "./field-utils.service";
import { Piece } from "./piece.model";

export class HtmlPieceReneder {
  constructor(
    private renderer: Renderer2,
    private fieldUtils: FieldUtilsService,
    private boardNativeElement: any,
    private fieldSize: number) { }

  preRenderPieces(pieces: Piece[]) {
    for(let piece of pieces) {
      const htmlElement = this.renderer.createElement('img')
      this.renderer.setAttribute(htmlElement, 'hidden', 'true')
      this.renderer.setAttribute(htmlElement, 'src', piece.imagePath)
      this.renderer.setAttribute(htmlElement, 'draggable', 'false')
      this.renderer.setStyle(htmlElement, 'height', piece.desiredHeight + 'px')

      // htmlElement.onload = () => {
      //   return Promise.resolve()
      // }
      this.renderer.appendChild(this.boardNativeElement, htmlElement)
      piece.setHtmlElement(htmlElement)   
    }
  }

  resizePieces(pieces: Piece[]) {
    for(let piece of pieces) {
      piece.setDesiredHeight()
      this.renderer.setStyle(piece.htmlElement, 'height', piece.desiredHeight + 'px')
    }
  }

  renderPieceByCoursor(mouseX: number, mouseY: number, piece: Piece) {
    //this.createElementIfNotExists(piece)
    this.renderer.removeAttribute(piece.htmlElement, 'hidden')
    this.renderer.setStyle(piece.htmlElement, 'z-index', '999')
    this.setElementLocation(piece.htmlElement, { x: mouseX - piece.htmlElement.width/2, y: mouseY - piece.htmlElement.height/2 })  
  }

  renderPieceAtField(field: string, piece: Piece) {
    //this.createElementIfNotExists(piece)
    this.renderer.removeAttribute(piece.htmlElement, 'hidden')
    this.renderer.setStyle(piece.htmlElement, 'z-index', '1')
    this.setElementLocation(piece.htmlElement, this.getPieceLocationAtField(field, piece))
  }

  renderPieceMovement(destinationField: string, piece: Piece) {
    this.setElementAnimation(piece);
    this.moveElementToTop(piece);
    this.setElementLocation(piece.htmlElement, this.getPieceLocationAtField(destinationField, piece))
    setTimeout(() => {
      this.clearElementAnimation(piece);
      this.moveElementToBackground(piece);
    }, 600)
  }

  deletePiece(piece: Piece, field: string) {
    setTimeout(() => {
      this.renderer.setAttribute(piece.htmlElement, 'hidden', 'true')
    }, 300)
  }

  deletePieceNow(piece: Piece) {
      this.renderer.setAttribute(piece.htmlElement, 'hidden', 'true')
  }

  private moveElementToBackground(piece: Piece) {
    this.renderer.setStyle(piece.htmlElement, 'z-index', '1');
  }

  private moveElementToTop(piece: Piece) {
    this.renderer.setStyle(piece.htmlElement, 'z-index', '999');
  }

  private clearElementAnimation(piece: Piece) {
    this.renderer.setStyle(piece.htmlElement, "transition", "none");
  }

  private setElementAnimation(piece: Piece) {
    this.renderer.setStyle(piece.htmlElement, "transition", "all 500ms ease");
  }

// private createElementIfNotExists(piece: Piece) {
//     if (!piece.htmlElement) {
//       const htmlElement = this.renderer.createElement('img')
//       this.renderer.setAttribute(htmlElement, 'hidden', 'true')
//       this.renderer.setAttribute(htmlElement, 'src', piece.imagePath)
//       this.renderer.setAttribute(htmlElement, 'draggable', 'false')
//       this.renderer.setStyle(htmlElement, 'height', piece.desiredHeight + 'px')
//       this.renderer.appendChild(this.boardNativeElement, htmlElement)
//       piece.setHtmlElement(htmlElement)   
//     }
//   }

  private setElementLocation(pieceImageElement: any, pieceLocation: { x: number, y: number }) {
    this.renderer.setStyle(pieceImageElement, 'left', pieceLocation.x + 'px')
    this.renderer.setStyle(pieceImageElement, 'top', pieceLocation.y + 'px')
  }

  private getPieceLocationAtField(field: string, piece: Piece) {
    return this.fieldUtils.determinePieceLocationAtField(field, this.fieldSize, piece)
  }
}
