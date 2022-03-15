import { Point } from "./point.model";

export class PieceMovement {

    pieceOnTheMove: HTMLImageElement;
    private pieceOnTheMoveStart: Point;
    private pieceOnTheMoveDestination: Point;
    private pieceOnTheMoveLocation: Point
    destinationAchieved: boolean = false;

    private xBaseSpeed: number;
    private yBaseSpeed: number;

    constructor(pieceOnTheMove: HTMLImageElement, pieceOnTheMoveStart: Point, pieceOnTheMoveDestination: Point) {
        this.pieceOnTheMove = pieceOnTheMove;
        this.pieceOnTheMoveStart = pieceOnTheMoveStart;
        this.pieceOnTheMoveDestination = pieceOnTheMoveDestination;
        this.pieceOnTheMoveLocation = pieceOnTheMoveStart;

        this.initializeBaseSpeed();
    }

    private initializeBaseSpeed() {
        let baseSpeed = 750;
        let xDistance = this.pieceOnTheMoveDestination.x - this.pieceOnTheMoveStart.x;
        let yDistance = this.pieceOnTheMoveDestination.y - this.pieceOnTheMoveStart.y;

        let xyDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        let steps = xyDistance / baseSpeed;

        this.xBaseSpeed = xDistance / steps;
        this.yBaseSpeed = yDistance / steps;
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
        let xSpeed = this.xBaseSpeed * secondsPassed;
        let ySpeed = this.yBaseSpeed * secondsPassed;

        xSpeed = this.recalculateSpeedForLastStep(xSpeed, 
            Math.abs(this.pieceOnTheMoveDestination.x - this.pieceOnTheMoveLocation.x));

        ySpeed = this.recalculateSpeedForLastStep(ySpeed, 
            Math.abs(this.pieceOnTheMoveDestination.y - this.pieceOnTheMoveLocation.y));

        //  console.log('xSpeed: ' + xSpeed);
        //  console.log('ySpeed:' + ySpeed);

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

    private recalculateSpeedForLastStep(speed: number, distanceLeft: number): number {
        if (distanceLeft < Math.abs(speed)) {
            if (speed < 0) {
                return distanceLeft;
            } else {
                return -distanceLeft
            }
        } else {
            return speed
        }
    }
}