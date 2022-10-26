import { Piece } from "./piece.model";

export class Pieces {

    whiteBishop: Piece
    blackBishop: Piece
    whiteBishop2: Piece
    blackBishop2: Piece

    initialize() {
        this.whiteBishop = new Piece('white', 'bishop')
        this.blackBishop = new Piece('black', 'bishop')
        this.whiteBishop2 = new Piece('white', 'bishop')
        this.blackBishop2 = new Piece('black', 'bishop')
    }
}