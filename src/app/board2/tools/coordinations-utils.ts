import { ElementRef } from "@angular/core";

export class CoordinationsUtil {

    static convertAbsoluteToBoardRelativeCoords(absoluteX: number, absoluteY: number, boardContainer: ElementRef<HTMLCanvasElement>) {
        const {x, y} = boardContainer.nativeElement.getBoundingClientRect() // position of board container
        return {x: absoluteX - x, y: absoluteY-y}
    }
}