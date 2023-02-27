export interface MoveRequest {
    playerId: String,
    from: String,
    to: String,
    pawnPromotion: String | null
}