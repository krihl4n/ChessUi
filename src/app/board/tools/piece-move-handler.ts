import { PiecesLocations } from "./pieces-locations";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { GameService } from "src/app/services/game.service";
import { PiecePositionUpdate } from "src/app/model/piece-position-update.model";

export class PieceMoveHandler {

    constructor(private piecesLocations: PiecesLocations, private htmlPieceRenderer: HtmlPieceReneder, private gameService: GameService) {
        this.gameService.piecePositionChange.subscribe((update: PiecePositionUpdate) => {
            this.movePiece(update.primaryMove.from, update.primaryMove.to)
            if(update.secondaryMove) {
                this.movePiece(update.secondaryMove.from, update.secondaryMove.to)
            }
        })
    }

    movePiece(from: string, to: string) {
        const piece = this.piecesLocations.get(from)
        if(!piece) {
            console.log("no piece at " + from)
            return
        }

        const pieceAtDst = this.piecesLocations.get(to)
        this.htmlPieceRenderer.renderPieceMovement(to, piece)
        if(pieceAtDst) {
            this.htmlPieceRenderer.deletePiece(pieceAtDst, to)
        }
        this.piecesLocations.delete(from)
        this.piecesLocations.delete(to)
        this.piecesLocations.set(to, piece)
    }
}