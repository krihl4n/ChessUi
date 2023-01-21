import { FieldOccupation } from "./field-occupation.model"

export interface GameInfo {
    gameId: string,
    mode: string,
    player: Player,
    piecePositions: FieldOccupation[],
    turn: string
}

interface Player {
    id: string,
    color: string
}
