import { COLOR_BLACK, COLOR_WHITE } from "src/app/model/typings";
import { Piece } from "./piece.model";

export class Pieces {

    availablePieces: Piece[] = []

    initialize(fieldSize: number) {
        for(var i = 0; i < 8; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, "pawn", fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, "pawn", fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, "rook", fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, "rook", fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, "bishop", fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, "bishop", fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, "knight", fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, "knight", fieldSize))
        }


        this.availablePieces.push(new Piece(COLOR_WHITE, "king", fieldSize))
        this.availablePieces.push(new Piece(COLOR_BLACK, "king", fieldSize))

        this.availablePieces.push(new Piece(COLOR_WHITE, "queen", fieldSize))
        this.availablePieces.push(new Piece(COLOR_BLACK, "queen", fieldSize))
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