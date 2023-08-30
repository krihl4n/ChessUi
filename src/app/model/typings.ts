export const COLOR_WHITE = "white"
export const COLOR_BLACK = "black"

export const MODE_TEST = "test_mode"
export const MODE_VS_FRIEND = "vs_friend"
export const MODE_VS_COMPUTER = "vs_compoter"

export type Player = {
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

export type Piece  = {
    color: string,
    type: string
}

export type Move = {
    from: string,
    to: string
}

export type PieceCapture = {
    field: string,
    capturedPiece: Piece
}

export type FieldOccupation = {
    field: string,
    piece: Piece
}

export type GameResult = {
    result: string,
    reason: string
}

export type PossibleMoves = {
    from: string,
    to: string[]
}

export type GameStartEvent = {
    playerColor: string,
    recordedMoves: string[],
    captures: Captures,
    score: Score,
    piecePositions:  FieldOccupation[]
}

export type GameFinishedEvent = {
    gameResult: GameResult
}
