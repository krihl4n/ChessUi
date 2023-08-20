import { Piece } from "../board/tools/piece.model"
import { FieldOccupation } from "./field-occupation.model"
import { GameResult } from "./game-result.model"

export type GameInfo = {
    gameId: string,
    mode: string,
    player: Player,
    piecePositions: FieldOccupation[],
    turn: string,
    recordedMoves: string[],
    captures: Captures,
    score: Score,
    result: GameResult | null
}

type Player = {
    id: string,
    color: string
}

export type Captures = {
    capturesOfWhitePlayer: Piece[],
    capturesOfBlackPlayer: Piece[],
}

export type Score = {
    white: number,
    black: number
}