import { PiecesLocations } from "./pieces-locations";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { GameService } from "src/app/services/game.service";
import { PiecePositionUpdate } from "src/app/model/piece-position-update.model";

export class PieceMoveHandler {

    constructor(private piecesLocations: PiecesLocations, private htmlPieceRenderer: HtmlPieceReneder, private gameService: GameService) {
        this.gameService.piecePositionChange.subscribe((update: PiecePositionUpdate) => {
            this.movePiece(update.primaryMove.from, update.primaryMove.to)
        })
    }

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