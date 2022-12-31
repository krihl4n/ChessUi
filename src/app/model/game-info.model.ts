import { FieldOccupation } from "./field-occupation.model"

export interface GameInfo {
    mode: string,
    player1: Player,
    player2: Player,
    piecePositions: FieldOccupation[]
}

interface Player {
    id: string,
    color: string
}
