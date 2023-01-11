import { FieldOccupation } from "./field-occupation.model"

export interface GameInfo {
    mode: string,
    player: Player,
    piecePositions: FieldOccupation[]
}

interface Player {
    id: string,
    color: string
}
