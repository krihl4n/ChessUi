export type MoveRequest = {
    gameId: string,
    playerId: string,
    from: string,
    to: string,
    pawnPromotion: string | null
}