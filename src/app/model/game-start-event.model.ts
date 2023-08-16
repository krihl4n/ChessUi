import { Captures, Score } from "./game-info.model";

export interface GameStartEvent {
    playerColor: string,
    recordedMoves: string[],
    captures: Captures,
    score: Score
}
