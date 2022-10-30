import { BoardSetup } from "./board-setup";
import { FieldUtilsService } from "./field-utils.service";
import { HtmlPieceReneder } from "./html-piece-renderer";
import { PiecesLocations } from "./pieces-locations";
import { Point } from "./point.model";

export class MarkAndMoveHandler {

    private markedField: string | null
    private previouslyMarkedField: string | null
    private pieceMoved: boolean

    constructor(private fieldUtils: FieldUtilsService, private boardSetup: BoardSetup, private piecesLocations: PiecesLocations, private renderer: HtmlPieceReneder) { }

    notifyMouseDownEvent(point: Point) {
        this.previouslyMarkedField = this.markedField
        const field = this.fieldUtils.determineFieldAtPos(point, this.boardSetup.fieldSize)
        if(!field) {
            return
        }
        
        const piece = this.piecesLocations.get(field)
        if (piece) {
            this.markedField = field
        }
    }

    notifyMouseUpEvent(point: Point) {
        const field = this.fieldUtils.determineFieldAtPos(point, this.boardSetup.fieldSize)
        console.log(this.previouslyMarkedField)
        if(field && this.previouslyMarkedField && field != this.previouslyMarkedField) {
            const pieceToMove = this.piecesLocations.get(this.previouslyMarkedField)
            if(pieceToMove) {
                const pieceAtDst = this.piecesLocations.get(field) 
                if(!pieceAtDst) {
                    this.piecesLocations.delete(this.previouslyMarkedField)
                    this.renderer.renderPieceMovement(field, pieceToMove)
                    this.piecesLocations.set(field, pieceToMove)
                }
                if(pieceAtDst?.color != pieceToMove.color) {
                    console.log("attack")
                }
            }
        }
        if(field && field == this.markedField) {
            if(this.previouslyMarkedField != field) {
                   
            } else {
                this.previouslyMarkedField = this.markedField
                this.markedField = null
            }
        } else {
            this.previouslyMarkedField = this.markedField
            this.markedField = null
        }
    }

    fieldIsMarked(field: string) {
        return this.markedField == field
    }
}