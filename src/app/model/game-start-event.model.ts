import { Captures } from "./game-info.model";

export interface GameStartEvent {
    playerColor: string,
    recordedMoves: string[],
    captures: Captures
}
