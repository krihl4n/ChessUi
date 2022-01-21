export interface PiecePositionUpdate {
    primaryMove: Move,
    secondaryMove: Move | null,
    positionCapture: PieceCapture | null
    reverted: Boolean,
}

interface Move {
    from: String,
    to: String
}

interface Piece {
    color: String,
    type: String
}

interface PieceCapture {
    field: String,
    capturedPiece: Piece
}
