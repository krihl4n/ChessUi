import { Score } from "./game-info.model";
import { Piece } from "./piece.model";

export type PiecePositionUpdate = {
    primaryMove: Move,
    secondaryMove: Move | null,
    pieceCapture: PieceCapture | null,
    pawnPromotion: string, // queen, knight, bishop, rook
    reverted: Boolean,
    turn: string,
    label: string,
    score: Score
}

type Move = {
    from: string,
    to: string
}

type PieceCapture = {
    field: string,
    capturedPiece: Piece
}
