export interface StartGameRequest {
    playerId: string,
    mode: string,
    colorPreference: string | null
}