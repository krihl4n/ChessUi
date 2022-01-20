export interface PiecePositionUpdate {
    primaryMove: Move,
    secondaryMove: Move | null
}

interface Move {
    from: String,
    to: String
}