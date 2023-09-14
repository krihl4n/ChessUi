import { Renderer2 } from "@angular/core";
import { Piece } from "./piece.model";

export class PieceFactory {

    private availablePieces: Piece[] = []

    constructor(
        private renderer: Renderer2, 
        private boardNativeElement: any,
        private fieldSize: number) {
        
        this.preRenderPieces()
    }

    getPiece(color: string, type: string): Piece {
        const index = this.availablePieces.findIndex(piece => piece.color == color && piece.type == type)
        const piece: Piece = this.availablePieces[index] 
        this.availablePieces.splice(index, 1)
        this.availablePieces.push(this.preRenderPiece(color, type))
        return piece
    }

    private preRenderPieces() {
        
        for(let i = 0; i < 8; i++) {
           this.availablePieces.push(this.preRenderPiece("white", "pawn"))
           this.availablePieces.push(this.preRenderPiece("black", "pawn"))
        }

        for(let i = 0; i < 10; i++ ) {
            this.availablePieces.push(this.preRenderPiece("white", "bishop"))
            this.availablePieces.push(this.preRenderPiece("black", "bishop"))
            this.availablePieces.push(this.preRenderPiece("white", "knight"))
            this.availablePieces.push(this.preRenderPiece("black", "knight"))
        }

        for(let i = 0; i < 9; i++) {
            this.availablePieces.push(this.preRenderPiece("white", "queen"))
            this.availablePieces.push(this.preRenderPiece("black", "queen"))
         }        

         for(let i = 0; i < 2; i++) {
            this.availablePieces.push(this.preRenderPiece("white", "rook"))
            this.availablePieces.push(this.preRenderPiece("black", "rook"))
         }
        
         this.availablePieces.push(this.preRenderPiece("white", "king"))
         this.availablePieces.push(this.preRenderPiece("black", "king"))
    }


    private preRenderPiece(color: string, type: string) {
        const piece = new Piece(color, type, this.fieldSize)
        const htmlElement = this.renderer.createElement('img')
        this.renderer.setAttribute(htmlElement, 'hidden', 'true')
        this.renderer.setAttribute(htmlElement, 'src', piece.imagePath)
        this.renderer.setAttribute(htmlElement, 'draggable', 'false')
        this.renderer.setStyle(htmlElement, 'height', piece.desiredHeight + 'px')
        this.renderer.appendChild(this.boardNativeElement, htmlElement)
        piece.setHtmlElement(htmlElement)   
        piece.width = htmlElement.width
        piece.height = htmlElement.height
        return piece
    }
}