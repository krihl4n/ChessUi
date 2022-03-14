import { Point } from "./point.model";

export class PieceDrag {

    mouseLocation: Point
    piece: HTMLImageElement

    constructor(piece: HTMLImageElement, mouseLocation: Point) {
        this.piece = piece;
        this.mouseLocation = mouseLocation
    }

    updateMouseLocation(x: number, y: number) {
        this.mouseLocation = {x, y}
    }

    getPieceLocation(): Point{
        return {
            x: this.mouseLocation.x - this.piece.width/2,
            y: this.mouseLocation.y-this.piece.height/2
        }
    }
}