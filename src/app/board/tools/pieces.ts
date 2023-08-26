import { Piece } from "./piece.model";

export class Pieces {

    availablePieces: Piece[] = []

    initialize(fieldSize: number) {
        for(var i = 0; i < 8; i++){
            this.availablePieces.push(new Piece('white', "pawn", fieldSize))
            this.availablePieces.push(new Piece('black', "pawn", fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece('white', "rook", fieldSize))
            this.availablePieces.push(new Piece('black', "rook", fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece('white', "bishop", fieldSize))
            this.availablePieces.push(new Piece('black', "bishop", fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece('white', "knight", fieldSize))
            this.availablePieces.push(new Piece('black', "knight", fieldSize))
        }


        this.availablePieces.push(new Piece('white', "king", fieldSize))
        this.availablePieces.push(new Piece('black', "king", fieldSize))

        this.availablePieces.push(new Piece('white', "queen", fieldSize))
        this.availablePieces.push(new Piece('black', "queen", fieldSize))
    }

    getPiece(color: string, type: string): Piece | undefined {
        const piece = this.availablePieces.find(p => p.color == color.toLowerCase() && p.type == type.toLowerCase())
        if (piece) {
            const index = this.availablePieces.indexOf(piece)
            this.availablePieces.splice(index, 1)
            return piece
        }
        return undefined
    }
}