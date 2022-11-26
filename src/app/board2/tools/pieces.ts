import { BoardSetup } from "./board-setup";
import { Piece } from "./piece.model";

export class Pieces {

    availablePieces: Piece[] = []

    initialize(boardSetup: BoardSetup) {
        for(var i = 0; i < 8; i++){
            this.availablePieces.push(new Piece('white', "pawn", boardSetup))
            this.availablePieces.push(new Piece('black', "pawn", boardSetup))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece('white', "rook", boardSetup))
            this.availablePieces.push(new Piece('black', "rook", boardSetup))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece('white', "bishop", boardSetup))
            this.availablePieces.push(new Piece('black', "bishop", boardSetup))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece('white', "knight", boardSetup))
            this.availablePieces.push(new Piece('black', "knight", boardSetup))
        }


        this.availablePieces.push(new Piece('white', "king", boardSetup))
        this.availablePieces.push(new Piece('black', "king", boardSetup))

        this.availablePieces.push(new Piece('white', "queen", boardSetup))
        this.availablePieces.push(new Piece('black', "queen", boardSetup))
    }

    getPiece(color: string, type: string): Piece | null {
        const piece = this.availablePieces.find(p => p.color == color.toLowerCase() && p.type == type.toLowerCase())
        if (piece) {
            const index = this.availablePieces.indexOf(piece)
            this.availablePieces.splice(index, 1)
            return piece
        }
        return null
    }
}