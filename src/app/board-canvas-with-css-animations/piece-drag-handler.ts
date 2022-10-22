import { FieldUtilsService } from "../board-canvas/field-utils.service";
import { Piece } from "./piece.model";

export class PieceDragHandler {

    constructor(private fieldUtils: FieldUtilsService) {}

    notifyMouseDownEvent(x: number, y: number) {
        //const field = this.fieldUtils.determineFieldAtPos(x, y, this.fieldSize)
    }

    notifyMouseUpEvent() {

    }

    initiatePieceDragMovement(startField: string, piece: Piece) {

    }

    updatePiecePosition() {

    }

    finishPieceDragMovement() {

    }
}