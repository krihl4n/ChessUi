export interface JoinGameRequest {
    gameId: string,
    colorPreference: string | null,
    playerId: string | null,
    rejoin: boolean
}