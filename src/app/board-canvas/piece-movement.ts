import { Point } from "./point.model";

export class PieceMovement {

    pieceOnTheMove: HTMLImageElement;
    private pieceOnTheMoveStart: Point;
    private pieceOnTheMoveDestination: Point;
    private pieceOnTheMoveLocation: Point
    destinationAchieved: boolean = false;

    constructor(pieceOnTheMove: HTMLImageElement, pieceOnTheMoveStart: Point, pieceOnTheMoveDestination: Point) {
        this.pieceOnTheMove = pieceOnTheMove;
        this.pieceOnTheMoveStart = pieceOnTheMoveStart;
        this.pieceOnTheMoveDestination = pieceOnTheMoveDestination;
        this.pieceOnTheMoveLocation = pieceOnTheMoveStart;



    }

    get currentLocation(): Point {
        return {
            x: this.pieceOnTheMoveLocation.x,
            y: this.pieceOnTheMoveLocation.y
        }
    }

    get destination(): Point {
        return {
            x: this.pieceOnTheMoveDestination.x,
            y: this.pieceOnTheMoveDestination.y
        }
    }

    updatePieceOnTheMove(secondsPassed: number) {

        let baseSpeed = 750;
        let xDistance = this.pieceOnTheMoveDestination.x - this.pieceOnTheMoveStart.x;
        let yDistance = this.pieceOnTheMoveDestination.y - this.pieceOnTheMoveStart.y;

        let xyDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        let steps = xyDistance / baseSpeed;

        let xSpeed = (xDistance / steps) * secondsPassed;
        let ySpeed = (yDistance / steps) * secondsPassed;

        //  console.log('xSpeed: ' + xSpeed);
        //  console.log('ySpeed:' + ySpeed);

        let xDistanceLeft = Math.abs(this.pieceOnTheMoveDestination.x - this.pieceOnTheMoveLocation.x)
        if (xDistanceLeft < Math.abs(xSpeed)) {
            if (xSpeed < 0) {
                xSpeed = xDistanceLeft;
            } else {
                xSpeed = -xDistanceLeft
            }
        }

        let yDistanceLeft = Math.abs(this.pieceOnTheMoveDestination.y - this.pieceOnTheMoveLocation.y)
        if (yDistanceLeft < Math.abs(ySpeed)) {
            if (ySpeed < 0) {
                ySpeed = yDistanceLeft;
            } else {
                ySpeed = -yDistanceLeft
            }
        }

        let dstXAchieved = false
        let dstYAchieved = false

        if (xSpeed == 0 ||
            xSpeed > 0 && this.pieceOnTheMoveLocation.x >= this.pieceOnTheMoveDestination.x ||
            xSpeed < 0 && this.pieceOnTheMoveLocation.x <= this.pieceOnTheMoveDestination.x
        ) {
            dstXAchieved = true
        }

        if (ySpeed == 0 ||
            ySpeed > 0 && this.pieceOnTheMoveLocation.y >= this.pieceOnTheMoveDestination.y ||
            ySpeed < 0 && this.pieceOnTheMoveLocation.y <= this.pieceOnTheMoveDestination.y
        ) {
            dstYAchieved = true
        }

        if (dstXAchieved && dstYAchieved) {
            this.destinationAchieved = true;
            return;
        }

        if (!dstXAchieved) {
            this.pieceOnTheMoveLocation.x = this.pieceOnTheMoveLocation.x + xSpeed;
        }

        if (!dstYAchieved) {
            this.pieceOnTheMoveLocation.y = this.pieceOnTheMoveLocation.y + ySpeed;
        }

    }
}