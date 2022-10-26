import { Piece } from "./piece.model";

export class Pieces {

    whiteBishop: Piece
    blackBishop: Piece

    initialize() {
        this.whiteBishop = new Piece('white', 'bishop')
        this.blackBishop = new Piece('black', 'bishop')
    }
}