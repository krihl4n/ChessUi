import { Renderer2, RendererStyleFlags2 } from "@angular/core";
import { PAWN } from "src/app/model/typings";
import { FieldUtilsService } from "./field-utils.service";
import { PieceFactory } from "./piece-factory";
import { Piece } from "./piece.model";

export class HtmlPieceReneder {

  private pieceFactory: PieceFactory

  constructor(
    private renderer: Renderer2,
    private fieldUtils: FieldUtilsService,
    private boardNativeElement: any,
    private fieldSize: number,
    private onPieceClickListener: any) {

    this.pieceFactory = new PieceFactory(renderer, boardNativeElement, fieldSize)
  }

  renderPiece(color: string, type: string, field: string): Piece {
    const piece = this.pieceFactory.getPiece(color, type)
    this.renderPieceAtField(field, piece)
    return piece
  }

  resizePieces(pieces: Piece[]) {
    for (let piece of pieces) {
      piece.setDesiredHeight()
      this.renderer.setStyle(piece.htmlElement, 'height', piece.desiredHeight + 'px')
      piece.width = piece.htmlElement.width
      piece.height = piece.htmlElement.height
    }
  }

  renderPieceByCoursor(mouseX: number, mouseY: number, piece: Piece) {
    this.renderer.removeAttribute(piece.htmlElement, 'hidden')
    this.renderer.setStyle(piece.htmlElement, 'z-index', '999')
    this.setElementLocation(piece.htmlElement, { x: mouseX - piece.getWidth() / 2, y: mouseY - piece.getHeight() / 2 })
  }

  renderPieceAtField(field: string, piece: Piece) {
    this.renderer.removeAttribute(piece.htmlElement, 'hidden')
    this.renderer.setStyle(piece.htmlElement, 'z-index', '1')
    this.setElementLocation(piece.htmlElement, this.getPieceLocationAtField(field, piece))
    piece.setMouseDownListener(this.onPieceClickListener.notifyPieceClicked.bind(this.onPieceClickListener)) // todo moze nie przekazywać tutaj onPieceClickListenera? 
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

  renderPieceChange(field: string, newPieceType: string, piece: Piece) {
    this.deletePieceNow(piece)
    const newPiece = this.renderPiece(piece.color, newPieceType, field)
    return newPiece
  }

  renderPieceMovementWithPieceChange(destinationField: string, piece: Piece, newPieceType: string) {
    this.setElementAnimation(piece);
    this.moveElementToTop(piece);
    this.setElementLocation(piece.htmlElement, this.getPieceLocationAtField(destinationField, piece))

    const newPiece = this.pieceFactory.getPiece(piece.color, newPieceType)
    setTimeout(() => {
      this.clearElementAnimation(piece);
      this.deletePieceNow(piece)
      this.renderPieceAtField(destinationField, newPiece)
    }, 600)
    return newPiece
  }

  renderPieceChangeWithPieceMovement(startingField: string, destinationField: string, piece: Piece) {
    const newPiece = this.pieceFactory.getPiece(piece.color, PAWN)
    this.renderPieceAtField(startingField, newPiece)
    this.deletePieceNow(piece)

    this.setElementAnimation(newPiece);
    this.moveElementToTop(newPiece);
    this.setElementLocation(newPiece.htmlElement, this.getPieceLocationAtField(destinationField, newPiece))

    setTimeout(() => {
      this.clearElementAnimation(newPiece);
      this.moveElementToBackground(newPiece)
    }, 600)
    return newPiece
  }

  deletePiece(piece: Piece, field: string) {
    setTimeout(() => {
      this.renderer.setAttribute(piece.htmlElement, 'hidden', 'true')
    }, 300)
  }

  deletePieceNow(piece: Piece) { // todo remove completly or clear listeners?
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

  private setElementLocation(pieceImageElement: any, pieceLocation: { x: number, y: number }) {
    this.renderer.setStyle(pieceImageElement, 'left', pieceLocation.x + 'px')
    this.renderer.setStyle(pieceImageElement, 'top', pieceLocation.y + 'px')
  }

  private getPieceLocationAtField(field: string, piece: Piece) {
    return this.fieldUtils.determinePieceLocationAtField(field, this.fieldSize, piece)
  }
}
