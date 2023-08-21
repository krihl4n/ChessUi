import { Captures, FieldOccupation, Move, Piece, PieceCapture, Player, Score, GameResult } from "./typings"

export type GameInfoMessage = {
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

export type GameStartEvent = {
    playerColor: string,
    recordedMoves: string[],
    captures: Captures,
    score: Score,
    piecePositions:  FieldOccupation[]
}

export type FieldOccupationMessage = {
    field: string,
    piece: Piece
}

export type GameResultMessage = {
    result: string,
    reason: string
}

export type GameStateUpdate  = {
    gameState: string
}

export type PossibleMovesMessage = {
    from: string,
    to: string[]
}
