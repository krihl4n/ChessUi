export interface MoveRequest {
    gameId: String,
    playerId: String,
    from: String,
    to: String,
    pawnPromotion: String | null
}