import { BoardSetup } from "./board-setup";
import { FieldUtilsService } from "./field-utils.service";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { PiecesLocations } from "./pieces-locations";
import { Point } from "./point.model";

export class MarkAndMoveHandler {

    private markedField: string | null
    private previouslyMarkedField: string | null
    private pieceMoved: boolean

    constructor(private fieldUtils: FieldUtilsService, private boardSetup: BoardSetup, private piecesLocations: PiecesLocations, private renderer: HtmlPieceReneder) {}

    notifyMouseDownEvent() {
        this.previouslyMarkedField = this.markedField
        this.markedField = null
    }

    notifyMouseUpEvent(point: Point) {
        const field = this.fieldUtils.determineFieldAtPos(point, this.boardSetup.fieldSize)
        if(!this.markedField) {
            if(field) {
                const piece = this.piecesLocations.get(field)
                if(piece && !this.pieceMoved) {
                    this.markedField = field
                }
            }
        } 

        if(this.previouslyMarkedField) {
            const pieceToMove = this.piecesLocations.get(this.previouslyMarkedField)
            if(field) {
                const pieceAtDstField = this.piecesLocations.get(field)
                if(pieceAtDstField && pieceAtDstField.color == pieceToMove?.color) {
                    this.markedField = field
                } else {
                    if(field && pieceToMove) {
                        this.piecesLocations.delete(this.previouslyMarkedField)
                        this.renderer.renderPieceMovement(field, pieceToMove)
                        this.piecesLocations.set(field, pieceToMove)
                        this.previouslyMarkedField = null
                        this.markedField = null
                    }
                }  
            }
        }
        
        this.pieceMoved = false
    }

    fieldIsMarked(field: string) {
        return this.markedField == field
    }

    pieceMovedListener() { // todo maybe register also in piece-move-handler
        console.log("notified about piece movement")
        this.markedField = null
        this.pieceMoved = true
        this.previouslyMarkedField = null
    }
}