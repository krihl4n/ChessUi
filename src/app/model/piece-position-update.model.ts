import { Piece } from "./piece.model";

export interface PiecePositionUpdate {
    primaryMove: Move,
    secondaryMove: Move | null,
    pieceCapture: PieceCapture | null,
    convertToQueen: Boolean,
    reverted: Boolean,
}

interface Move {
    from: String,
    to: String
}

interface PieceCapture {
    field: String,
    capturedPiece: Piece
}
