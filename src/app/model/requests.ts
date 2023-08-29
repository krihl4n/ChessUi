import { Color } from "./typings"

export type StartGameRequest = {
    mode: string,
    setup: string
}

export type JoinGameRequest = {
    gameId: string,
    colorPreference?: Color,
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