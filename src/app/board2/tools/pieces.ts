import { BoardSetup } from "./board-setup";
import { Piece } from "./piece.model";

export class Pieces {

    whiteBishop: Piece
    blackBishop: Piece
    whiteBishop2: Piece
    blackBishop2: Piece

    initialize(boardSetup: BoardSetup) {
        this.whiteBishop = new Piece('white', 'bishop', boardSetup)
        this.blackBishop = new Piece('black', 'bishop', boardSetup)
        this.whiteBishop2 = new Piece('white', 'bishop', boardSetup)
        this.blackBishop2 = new Piece('black', 'bishop', boardSetup)
    }
}