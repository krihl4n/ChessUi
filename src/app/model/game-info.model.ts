export interface GameInfo {
    mode: string,
    player1: Player,
    player2: Player,
}

interface Player {
    id: string,
    color: string
}
