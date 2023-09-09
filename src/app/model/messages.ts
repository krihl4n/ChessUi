import { Captures, FieldOccupation, Move, Piece, PieceCapture, Player, Score, GameResult } from "./typings"

export type GameInfoMessage = {
    gameId: string,
    gameInProgress: boolean,
    mode: string,
    player: Player,
    piecePositions: FieldOccupation[],
    turn: string,
    recordedMoves: string[],
    captures: Captures,
    score: Score,
    result?: GameResult
}

export type PiecePositionUpdateMessage = {
    primaryMove: Move,
    secondaryMove?: Move,
    pieceCapture?: PieceCapture,
    pawnPromotion: string,
    reverted: boolean,
    turn: string,
    label: string,
    score: Score
}

export type FieldOccupationMessage = {
    field: string,
    piece: Piece
}

export type GameResultMessage = {
    result: string,
    reason: string
}

export type PossibleMovesMessage = {
    from: string,
    to: string[]
}

export type JoinedNewGameMessage = {
    gameId: string,
    playerId: string
}