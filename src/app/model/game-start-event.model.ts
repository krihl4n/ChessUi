import { Captures, Score } from "./game-info.model";

export type GameStartEvent = {
    playerColor: string,
    recordedMoves: string[],
    captures: Captures,
    score: Score
}
