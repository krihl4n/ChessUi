import { BoardSetup } from "./board-setup";
import { FieldUtilsService } from "./field-utils.service";
import { PiecesLocations } from "./pieces-locations";
import { Point } from "./point.model";

export class MarkAndMoveHandler {

    private markedField: string | null
    private markedPieceColor: string | null
    private pieceMoved: boolean

    constructor(private fieldUtils: FieldUtilsService, private boardSetup: BoardSetup, private piecesLocations: PiecesLocations) {}

    notifyMouseDownEvent() {
        this.markedField = null
        this.markedPieceColor = null
    }

    notifyMouseUpEvent(point: Point) {
        if(!this.markedField) {
            const field = this.fieldUtils.determineFieldAtPos(point, this.boardSetup.fieldSize)
            if(field) {
                const piece = this.piecesLocations.get(field)
                if(piece && !this.pieceMoved) {
                    console.log(this.pieceMoved)
                    console.log("marked field " + field)
                    this.markedField = field
                    this.markedPieceColor = piece.color
                }
            }
        } else {
            const field = this.fieldUtils.determineFieldAtPos(point, this.boardSetup.fieldSize)
            if(field) {
                const piece = this.piecesLocations.get(field)
                if(piece?.color == this.markedPieceColor) {
                    this.markedField = field
                } else {
                    this.markedField = null
                    this.markedPieceColor = null    
                }
            } else {
                this.markedField = null
                this.markedPieceColor = null
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
    }
}