export type StartGameRequest = {
    playerId: string,
    mode: string,
    setup: string
}

export type JoinGameRequest = {
    gameId: string,
    colorPreference?: string,
    playerId?: string
}

export type RejoinGameRequest = {
    gameId: string,
    playerId: string,
}

export type PossibleMovesRequest = {
    gameId: string,
    field: string,
}

export type MoveRequest = {
    gameId: string,
    playerId: string,
    from: string,
    to: string,
    pawnPromotion?: string
}

export type UndoMoveRequest = {
    gameId: string,
    playerId: string,
}

export type ResignRequest = {
    gameId: string,
    playerId: string,
}