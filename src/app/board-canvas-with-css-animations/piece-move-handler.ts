import { PiecesLocations } from "../board-canvas/pieces-locations";
import { HtmlPieceReneder } from "./html-piece-renderer";

export class PieceMoveHandler {

    constructor(private piecesLocations: PiecesLocations, private htmlPieceRenderer: HtmlPieceReneder) {}

    movePiece(from: string, to: string) {
        const piece = this.piecesLocations.get(from)
        if(!piece) {
            console.log("no piece at " + from)
            return
        }

        this.piecesLocations.delete(from)
        this.htmlPieceRenderer.renderPieceMovement(to, piece)
        this.piecesLocations.set(to, piece)
    }
}