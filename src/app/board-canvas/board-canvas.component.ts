import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { release } from 'os';
import { DrawingService } from './drawing.service';
import { FieldUtilsService } from './field-utils.service';
import { PieceDrag } from './piece-drag';
import { PieceMovement } from './piece-movement';
import { Point } from './point.model';

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.css']
})
export class BoardCanvasComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  canvasContext: CanvasRenderingContext2D;

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

  secondsPassed = 0;
  oldTimeStamp = 0;

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

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

    window.requestAnimationFrame(this.drawBackground.bind(this));
    //let framesPerSecond = 100;
    //setInterval(this.drawEverything.bind(this), 1000 / framesPerSecond);
    window.requestAnimationFrame(this.drawEverything.bind(this));

    this.canvas.nativeElement.addEventListener('contextmenu', (evt: MouseEvent) => {
      evt.preventDefault(); // todo check if works on other OSes
    })

    this.canvas.nativeElement.addEventListener('mousedown', (evt: MouseEvent) => {
      let xOnBoard = evt.clientX - this.boardX
      let yOnBoard = evt.clientY - this.boardY

      let leftClick = 0; // todo check other OSes

      if (evt.button == leftClick) {
        this.mouseDownAtField = this.locationUtilsService.determineFieldAtPos(xOnBoard, yOnBoard);
        this.dragPiece(xOnBoard, yOnBoard);
      }
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
        if (this.pieceDrag) {
          this.releasePiece();
          this.pieceSelectedAtField = null;
        }
        if(this.mouseDownAtField == this.locationUtilsService.determineFieldAtPos(xOnBoard, yOnBoard)) {
          this.selectOrMovePiece(xOnBoard, yOnBoard);
        }
      }
    })

    this.canvas.nativeElement.addEventListener('mousemove', (evt: MouseEvent) => {
      let xOnBoard = evt.clientX - this.boardX
      let yOnBoard = evt.clientY - this.boardY

      this.pieceDrag?.updateMouseLocation(xOnBoard, yOnBoard)
    })
  }

  mouseDownAtField: string 
  pieceDrag: PieceDrag | null;

  private dragPiece(x: number, y: number) {
    let field = this.locationUtilsService.determineFieldAtPos(x, y);
    if (this.fieldOccupations.has(field)) {
      let piece = this.fieldOccupations.get(field);
      this.pieceDrag = new PieceDrag(piece as HTMLImageElement, {x, y});
      this.fieldOccupations.delete(field)
    }
  }

  private releasePiece() {
    if(this.pieceDrag){
      let field = this.locationUtilsService.determineFieldAtPos(this.pieceDrag.mouseLocation.x, this.pieceDrag.mouseLocation.y);
      this.fieldOccupations.set(field, this.pieceDrag.piece);
      this.pieceDrag = null;
    }
  }

  private drawDraggedPiece() {
    if(this.pieceDrag) {
      this.drawingService.drawPicture(
        this.canvasContext,
        this.pieceDrag.piece,
        this.pieceDrag.getPieceLocation().x,
        this.pieceDrag.getPieceLocation().y
      )
    }
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

  pieceMovement: PieceMovement | null; // will need to be a collection

  private initiatePieceMovement(fromField: string, toField: string) {
    let piece = this.fieldOccupations.get(fromField);
    if (piece) {
      if (fromField == toField) {
        return
      }
      this.fieldOccupations.delete(fromField);
      let fromLocation = {
        x: this.fieldLocations.get(fromField)?.x || 0,
        y: this.fieldLocations.get(fromField)?.y || 0
      }
      let toLocation = {
        x: this.fieldLocations.get(toField)?.x || 0,
        y: this.fieldLocations.get(toField)?.y || 0,
      }

      if (fromLocation && toLocation) {
        fromLocation.x = fromLocation?.x + this.fieldSize / 2 - piece.width / 2;
        fromLocation.y = fromLocation?.y + this.fieldSize / 2 - piece.height / 2;

        toLocation.x = toLocation.x + this.fieldSize / 2 - piece.width / 2;
        toLocation.y = toLocation.y + this.fieldSize / 2 - piece.height / 2;

        this.pieceMovement = new PieceMovement(piece, fromLocation, toLocation);
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

    this.drawBackground();
    this.drawPieces();
    this.drawPieceOnTheMove();
    this.drawDraggedPiece();
    window.requestAnimationFrame(this.drawEverything.bind(this))
  }

  private drawPieceOnTheMove() {
    if (this.pieceMovement) {
      this.pieceMovement.updatePieceOnTheMove(this.secondsPassed);
      if (this.pieceMovement.destinationAchieved === true) {
        let field = this.locationUtilsService.determineFieldAtPos(this.pieceMovement.destination.x, this.pieceMovement.destination.y)
        this.fieldOccupations.set(field, this.pieceMovement.pieceOnTheMove);
        this.pieceMovement = null
      }

      if (this.pieceMovement) {
        this.drawingService.drawPicture(
          this.canvasContext,
          this.pieceMovement.pieceOnTheMove,
          this.pieceMovement.currentLocation.x,
          this.pieceMovement.currentLocation.y
        )
      }
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
      this.drawingService.drawPicture(this.canvasContext, pic,
        fieldLocation.x + this.fieldSize / 2 - pic.width / 2,
        fieldLocation.y + this.fieldSize / 2 - pic.height / 2)
    }
  }

  private drawBackground() {
    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.fieldSize;
        let rowPos = row * this.fieldSize;
        this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.fieldSize, this.fieldSize, currentColor)
        let field = this.locationUtilsService.determineFieldAtPos(colPos, rowPos);
        this.fieldLocations.set(field, { x: colPos, y: rowPos });

        if (this.markedFields.includes(field)) {
          this.drawingService.fillCircle(this.canvasContext, colPos + this.fieldSize / 2, rowPos + this.fieldSize / 2, this.fieldSize / 4, 'green')
        }

        if (this.pieceSelectedAtField == field) {
          this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.fieldSize, this.fieldSize, 'yellow')
        }

        if (col == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineRowAtPos(rowPos),
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.1,
            rowPos + this.fieldSize - this.fieldSize * 0.85);
        }
        if (row == 7) {
          this.drawingService.fillText(
            this.canvasContext,
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
