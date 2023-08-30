import { BISHOP, COLOR_BLACK, COLOR_WHITE, KING, KNIGHT, PAWN, QUEEN, ROOK } from "src/app/model/typings";
import { Piece } from "./piece.model";

export class Pieces {

    availablePieces: Piece[] = []

    initialize(fieldSize: number) {
        for(var i = 0; i < 8; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, PAWN, fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, PAWN, fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, ROOK, fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, ROOK, fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, BISHOP, fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, BISHOP, fieldSize))
        }

        for(var i = 0; i < 2; i++){
            this.availablePieces.push(new Piece(COLOR_WHITE, KNIGHT, fieldSize))
            this.availablePieces.push(new Piece(COLOR_BLACK, KNIGHT, fieldSize))
        }


        this.availablePieces.push(new Piece(COLOR_WHITE, KING, fieldSize))
        this.availablePieces.push(new Piece(COLOR_BLACK, KING, fieldSize))

        this.availablePieces.push(new Piece(COLOR_WHITE, QUEEN, fieldSize))
        this.availablePieces.push(new Piece(COLOR_BLACK, QUEEN, fieldSize))
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