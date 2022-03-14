import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DrawingService } from './drawing.service';
import { FieldUtilsService } from './field-utils.service';
import { Point } from './point.model';

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.css']
})
export class BoardCanvasComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  constructor(private renderer: Renderer2, private drawingService: DrawingService, private locationUtilsService: FieldUtilsService) {
  }

  canvasSize = 700;
  private boardFlipped = false;

  private boardSize = this.canvasSize;
  private fieldSize = this.boardSize / 8;
  private fieldColorLight = "#EBD1A6";
  private fieldColorDark = "#A27551";

  private boardX: number;
  private boardY: number;

  private fieldLocations = new Map<string, Point>();
  private whitePawnImg: HTMLImageElement;

  private markedFields: string[] = []

  private fieldOccupations = new Map<string, HTMLImageElement>()

  private pieceOnTheMove: HTMLImageElement | null; // todo will need to be a collection
  private pieceOnTheMoveLocation: Point;
  private pieceOnTheMoveStart: Point;
  private pieceOnTheMoveDestination: Point;

  secondsPassed = 0;
  oldTimeStamp = 0;

  ngOnInit(): void {
    this.drawingService.setCanvasContext(this.canvas.nativeElement.getContext('2d'))
    this.locationUtilsService.initialize(this.boardFlipped, this.fieldSize);
    this.boardX = this.canvas.nativeElement.getBoundingClientRect().x
    this.boardY = this.canvas.nativeElement.getBoundingClientRect().y

    this.whitePawnImg = this.renderer.createElement('img');
    this.whitePawnImg.onload = () => {
      console.log("img loaded") // todo start game when all images are loaded
      this.fieldOccupations.set("d4", this.whitePawnImg);
      this.fieldOccupations.set("g2", this.whitePawnImg)
    };
    this.whitePawnImg.src = "assets/white_pawn.png"; // todo other pieces


    //let framesPerSecond = 100;
    //setInterval(this.drawEverything.bind(this), 1000 / framesPerSecond);
    window.requestAnimationFrame(this.drawEverything.bind(this));

    this.canvas.nativeElement.addEventListener('contextmenu', (evt: MouseEvent) => {
      evt.preventDefault(); // todo check if works on other OSes
    })

    this.canvas.nativeElement.addEventListener('mouseup', (evt: MouseEvent) => {
      let xOnBoard = evt.clientX - this.boardX
      let yOnBoard = evt.clientY - this.boardY

      let leftClick = 0; // todo check other OSes
      let rightClick = 2;

      if (evt.button == rightClick) {
        this.markField(xOnBoard, yOnBoard);
      }

      if (evt.button == leftClick) {
        this.selectOrMovePiece(xOnBoard, yOnBoard);
      }
    })
  }

  pieceSelectedAtField: string | null

  private selectOrMovePiece(x: number, y: number) {
    let field = this.locationUtilsService.determineFieldAtPos(x, y);
    if (!this.pieceSelectedAtField) {
      if (this.fieldOccupations.has(field)) {
        this.pieceSelectedAtField = field;
      }
    } else {
      this.initiatePieceMovement(this.pieceSelectedAtField, field)
      this.pieceSelectedAtField = null;
    }
  }

  private initiatePieceMovement(fromField: string, toField: string) {
    let piece = this.fieldOccupations.get(fromField);
    if (piece) {
      if (fromField == toField) {
        return
      }
      this.fieldOccupations.delete(fromField);
      this.pieceOnTheMove = piece;
      let fromLocation = this.fieldLocations.get(fromField)
      let toLocation = this.fieldLocations.get(toField)

      if (fromLocation && toLocation) {
        fromLocation.x = fromLocation.x + this.fieldSize / 2 - piece.width / 2;
        fromLocation.y = fromLocation.y + this.fieldSize / 2 - piece.height / 2;

        toLocation.x = toLocation.x + this.fieldSize / 2 - piece.width / 2;
        toLocation.y = toLocation.y + this.fieldSize / 2 - piece.height / 2;

        this.pieceOnTheMoveLocation = fromLocation;
        this.pieceOnTheMoveStart = { x: fromLocation.x, y: fromLocation.y };
        this.pieceOnTheMoveDestination = toLocation;
      }
    }
  }

  private markField(x: number, y: number) {
    let field: string = this.locationUtilsService.determineFieldAtPos(x, y);
    const index = this.markedFields.indexOf(field, 0);
    if (index > -1) {
      this.markedFields.splice(index, 1);
    } else {
      this.markedFields.push(field)
    }
  }

  private drawEverything(timeStamp: any) {

    this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;
   // this.drawingService.clearEverything();
    this.drawBackground();
    this.drawPieces();
    this.drawPieceOnTheMove();

    window.requestAnimationFrame(this.drawEverything.bind(this))
  }

  private drawPieceOnTheMove() {
    if (this.pieceOnTheMove) {
      let baseSpeed = 1500;
      let xDistance = this.pieceOnTheMoveDestination.x - this.pieceOnTheMoveStart.x;
      let yDistance = this.pieceOnTheMoveDestination.y - this.pieceOnTheMoveStart.y;

      let xyDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      let steps = xyDistance / baseSpeed;

      let xSpeed = (xDistance / steps) * this.secondsPassed;
      let ySpeed = (yDistance / steps) * this.secondsPassed;

    //  let xSpeed = 30;
     // let ySpeed = 0;
      console.log('xSpeed: ' + xSpeed);
      console.log('ySpeed:' + ySpeed);

      let xDistanceLeft = Math.abs(this.pieceOnTheMoveDestination.x - this.pieceOnTheMoveLocation.x)
      if(xDistanceLeft < Math.abs(xSpeed)) {
        if(xSpeed < 0) {
          xSpeed = xDistanceLeft;
        } else {
          xSpeed = -xDistanceLeft
        }
      }

      let yDistanceLeft = Math.abs(this.pieceOnTheMoveDestination.y - this.pieceOnTheMoveLocation.y)
      if(yDistanceLeft < Math.abs(ySpeed)) {
        if(ySpeed < 0) {
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
        let field = this.locationUtilsService.determineFieldAtPos(this.pieceOnTheMoveDestination.x, this.pieceOnTheMoveDestination.y)
        this.fieldOccupations.set(field, this.pieceOnTheMove);
        this.pieceOnTheMove = null
        return;
      }

      if (!dstXAchieved) {
        this.pieceOnTheMoveLocation.x = this.pieceOnTheMoveLocation.x + xSpeed;
      }

      if (!dstYAchieved) {
        this.pieceOnTheMoveLocation.y = this.pieceOnTheMoveLocation.y + ySpeed;
      }

      this.drawingService.drawPicture(
        this.pieceOnTheMove,
        this.pieceOnTheMoveLocation.x,
        this.pieceOnTheMoveLocation.y
      )
    }
  }

  private drawPieces() {
    this.fieldOccupations.forEach((img: HTMLImageElement, field: string) => {
      this.drawPiecePictureAtField(img, field);
    })
  }

  private drawPiecePictureAtField(pic: HTMLImageElement, field: string) {
    let fieldLocation = this.fieldLocations.get(field);
    if (fieldLocation) {
      this.drawingService.drawPicture(pic,
        fieldLocation.x + this.fieldSize / 2 - pic.width / 2,
        fieldLocation.y + this.fieldSize / 2 - pic.height / 2)
    }
  }

  private drawBackground() {
  //  this.drawingService.fillRectangle(0,0,700,700,this.fieldColorLight)
    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.fieldSize;
        let rowPos = row * this.fieldSize;
        this.drawingService.fillRectangle(colPos, rowPos, this.fieldSize, this.fieldSize, currentColor)
        let field = this.locationUtilsService.determineFieldAtPos(colPos, rowPos);
        this.fieldLocations.set(field, { x: colPos, y: rowPos });

        if (this.markedFields.includes(field)) {
          this.drawingService.fillCircle(colPos + this.fieldSize / 2, rowPos + this.fieldSize / 2, this.fieldSize / 4, 'green')
        }

        if (this.pieceSelectedAtField == field) {
          this.drawingService.fillRectangle(colPos, rowPos, this.fieldSize, this.fieldSize, 'yellow')
        }

        if (col == 7) {
          this.drawingService.fillText(
            this.locationUtilsService.determineRowAtPos(rowPos),
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.1,
            rowPos + this.fieldSize - this.fieldSize * 0.85);
        }
        if (row == 7) {
          this.drawingService.fillText(
            this.locationUtilsService.determineColAtPos(colPos),
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.95,
            rowPos + this.fieldSize - this.fieldSize * 0.05);
        }
        currentColor = this.oppositeOf(currentColor)
      }
      currentColor = this.oppositeOf(currentColor)
    }
  }

  private oppositeOf(color: string): string {
    if (color == this.fieldColorLight) {
      return this.fieldColorDark
    } else {
      return this.fieldColorLight
    }
  }
}
