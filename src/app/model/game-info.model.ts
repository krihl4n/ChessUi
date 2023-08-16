import { Piece } from "../board/tools/piece.model"
import { FieldOccupation } from "./field-occupation.model"

export interface GameInfo {
    gameId: string,
    mode: string,
    player: Player,
    piecePositions: FieldOccupation[],
    turn: string,
    recordedMoves: string[],
    captures: Captures,
    score: Score
}

interface Player {
    id: string,
    color: string
}

export interface Captures {
    capturesOfWhitePlayer: Piece[],
    capturesOfBlackPlayer: Piece[],
}

export interface Score {
    white: number,
    black: number
}