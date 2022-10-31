import { BoardSetup } from "./board-setup";
import { Piece } from "./piece.model";

export class Pieces {

    whitePawn1: Piece
    whitePawn2: Piece
    whitePawn3: Piece
    whitePawn4: Piece
    whitePawn5: Piece
    whitePawn6: Piece
    whitePawn7: Piece
    whitePawn8: Piece

    whiteRook1: Piece
    whiteRook2: Piece
    whiteKnight1: Piece
    whiteKnight2: Piece
    whiteBishop1: Piece
    whiteBishop2: Piece
    whiteQueen: Piece
    whiteKing: Piece

    blackPawn1: Piece
    blackPawn2: Piece
    blackPawn3: Piece
    blackPawn4: Piece
    blackPawn5: Piece
    blackPawn6: Piece
    blackPawn7: Piece
    blackPawn8: Piece

    blackRook1: Piece
    blackRook2: Piece
    blackBishop1: Piece
    blackBishop2: Piece
    blackKnight1: Piece
    blackKnight2: Piece
    blackQueen: Piece
    blackKing: Piece

    initialize(boardSetup: BoardSetup) {
        this.whitePawn1 = new Piece('white', "pawn", boardSetup)
        this.whitePawn2 = new Piece('white', "pawn", boardSetup)
        this.whitePawn3 = new Piece('white', "pawn", boardSetup)
        this.whitePawn4 = new Piece('white', "pawn", boardSetup)
        this.whitePawn5 = new Piece('white', "pawn", boardSetup)
        this.whitePawn6 = new Piece('white', "pawn", boardSetup)
        this.whitePawn7 = new Piece('white', "pawn", boardSetup)
        this.whitePawn8 = new Piece('white', "pawn", boardSetup)

        this.whiteBishop1 = new Piece('white', 'bishop', boardSetup)
        this.whiteBishop2 = new Piece('white', 'bishop', boardSetup)
        this.whiteRook1 = new Piece('white', 'rook', boardSetup)
        this.whiteRook2 = new Piece('white', 'rook', boardSetup)
        this.whiteKnight1 = new Piece('white', 'knight', boardSetup)
        this.whiteKnight2 = new Piece('white', 'knight', boardSetup)
        this.whiteQueen = new Piece('white', 'queen', boardSetup)
        this.whiteKing = new Piece('white', 'king', boardSetup)

        this.blackPawn1 = new Piece('black', "pawn", boardSetup)
        this.blackPawn2 = new Piece('black', "pawn", boardSetup)
        this.blackPawn3 = new Piece('black', "pawn", boardSetup)
        this.blackPawn4 = new Piece('black', "pawn", boardSetup)
        this.blackPawn5 = new Piece('black', "pawn", boardSetup)
        this.blackPawn6 = new Piece('black', "pawn", boardSetup)
        this.blackPawn7 = new Piece('black', "pawn", boardSetup)
        this.blackPawn8 = new Piece('black', "pawn", boardSetup)

        this.blackBishop1 = new Piece('black', 'bishop', boardSetup)
        this.blackBishop2 = new Piece('black', 'bishop', boardSetup)
        this.blackRook1 = new Piece('black', 'rook', boardSetup)
        this.blackRook2 = new Piece('black', 'rook', boardSetup)
        this.blackKnight1 = new Piece('black', 'knight', boardSetup)
        this.blackKnight2 = new Piece('black', 'knight', boardSetup)
        this.blackQueen = new Piece('black', 'queen', boardSetup)
        this.blackKing = new Piece('black', 'king', boardSetup)
    }
}