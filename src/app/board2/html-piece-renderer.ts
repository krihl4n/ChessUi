import { Renderer2 } from "@angular/core";
import { FieldUtilsService } from "../board-canvas/field-utils.service";
import { Piece } from "./piece.model";

export class HtmlPieceReneder {
  constructor(
    private renderer: Renderer2,
    private fieldUtils: FieldUtilsService,
    private boardNativeElement: any,
    private fieldSize: number) { }

  renderPieceByCoursor(mouseX: number, mouseY: number, piece: Piece) {
    this.createElementIfNotExists(piece)
    this.renderer.setStyle(piece.htmlElement, 'z-index', '999')
    this.setElementLocation(piece.htmlElement, { x: mouseX - 28, y: mouseY - 35 }) // todo tune to piece size      
  }

  renderPieceAtField(field: string, piece: Piece) {
    this.createElementIfNotExists(piece)
    this.renderer.setStyle(piece.htmlElement, 'z-index', '1')
    this.setElementLocation(piece.htmlElement, this.getPieceLocationAtField(field)) // todo tune to piece size
  }

  renderPieceMovement(destinationField: string, piece: Piece) {
    this.setElementAnimation(piece);
    this.moveElementToTop(piece);
    this.setElementLocation(piece.htmlElement, this.getPieceLocationAtField(destinationField))
    setTimeout(() => {
      this.clearElementAnimation(piece);
      this.moveElementToBackground(piece);
    }, 600)
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

  private createElementIfNotExists(piece: Piece) {
    if (!piece.htmlElement) {
      const htmlElement = this.renderer.createElement('img')
      this.renderer.setAttribute(htmlElement, 'src', piece.imagePath)
      this.renderer.setAttribute(htmlElement, 'draggable', 'false')
      this.renderer.appendChild(this.boardNativeElement, htmlElement)
      piece.setHtmlElement(htmlElement)
    }
  }

  private setElementLocation(pieceImageElement: any, pieceLocation: { x: number, y: number }) {
    this.renderer.setStyle(pieceImageElement, 'left', pieceLocation.x + 'px')
    this.renderer.setStyle(pieceImageElement, 'top', pieceLocation.y + 'px')
  }

  private getPieceLocationAtField(field: string) {
    return this.fieldUtils.determinePieceLocationAtField(field, this.fieldSize)
  }
}
