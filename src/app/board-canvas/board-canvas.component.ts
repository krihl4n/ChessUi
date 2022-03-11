import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debug } from 'console';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.css']
})
export class BoardCanvasComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;

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

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    this.boardX = this.canvas.nativeElement.getBoundingClientRect().x
    this.boardY = this.canvas.nativeElement.getBoundingClientRect().y

    this.whitePawnImg = document.createElement("img");
    this.whitePawnImg.onload = () => { 
      console.log("img loaded")
    };
    this.whitePawnImg.src = "assets/white_pawn.png";


    let framesPerSecond = 30;
    setInterval(this.drawEverything.bind(this), 1000 / framesPerSecond);


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
    })
  }

  private markField(x: number, y: number) {
    let field: string = this.determineFieldAtPos(x, y);
    const index = this.markedFields.indexOf(field, 0);
    if (index > -1) {
      this.markedFields.splice(index, 1);
    } else {
      this.markedFields.push(field)
    }
  }

  private determineFieldAtPos(x: number, y: number) {
    return this.determineColAtPos(x) + this.determineRowAtPos(y);
  }

  private drawEverything() {
    this.drawBackground();
    this.drawPieces();
  }

  private drawPieces() {
    //this.drawPiecePicture(this.whitePawnImg, 0 + this.fieldSize/2, 0 + this.fieldSize/2);
    this.drawPiecePictureAtField(this.whitePawnImg, "a1");
  }

  private drawPiecePictureAtField(pic: HTMLImageElement, field: string) {
    let fieldLocation = this.fieldLocations.get(field);
    if(fieldLocation){
      this.drawPiecePicture(pic, 
        fieldLocation.x + this.fieldSize/2 - pic.width/2, 
        fieldLocation.y + this.fieldSize/2 - pic.height/2)
    }
  }

  private drawPiecePicture(pic: HTMLImageElement, x: number, y: number) {
    this.context.save();
    this.context.translate(x, y);
    this.context.drawImage(pic, 0, 0);
    this.context.restore();
  }

  private drawBackground() {

    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.fieldSize;
        let rowPos = row * this.fieldSize;
        this.fillRectangle(colPos, rowPos, this.fieldSize, this.fieldSize, currentColor)
        let field = this.determineFieldAtPos(colPos, rowPos);
        this.fieldLocations.set(field, {x:colPos, y:rowPos});

        if (this.markedFields.includes(field)) {
          this.context.fillStyle = 'green';
          this.context.beginPath();
          this.context.arc(colPos + this.fieldSize / 2, rowPos + this.fieldSize / 2, this.fieldSize / 4, 0, Math.PI * 2, true);
          this.context.fill();
        }

        if (col == 7) {
          this.fillText(
            this.determineRowAtPos(rowPos),
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.1,
            rowPos + this.fieldSize - this.fieldSize * 0.85);
        }
        if (row == 7) {
          this.fillText(
            this.determineColAtPos(colPos),
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.95,
            rowPos + this.fieldSize - this.fieldSize * 0.05);
        }
        currentColor = this.oppositeOf(currentColor)
      }
      currentColor = this.oppositeOf(currentColor)
    }
  }

  private determineRowAtPos(y: number): string {
    let rows = ['8', '7', '6', '5', '4', '3', '2', '1']

    if (this.boardFlipped) {
      rows.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (y >= i * this.fieldSize && y < i * this.fieldSize + this.fieldSize) {
        return rows[i]
      }
    }
    return "x";
  }

  private determineColAtPos(x: number): string {
    let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    if (this.boardFlipped) {
      cols.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (x >= i * this.fieldSize && x < i * this.fieldSize + this.fieldSize) {
        return cols[i]
      }
    }
    return "x";
  }

  private fillText(txt: string, color: string, x: number, y: number) {
    this.context.fillStyle = color;
    this.context.font = "12px Georgia"; // todo scale 
    this.context.fillText(txt, x, y);
  }

  private oppositeOf(color: string): string {
    if (color == this.fieldColorLight) {
      return this.fieldColorDark
    } else {
      return this.fieldColorLight
    }
  }

  private fillRectangle(x: number, y: number, w: number, h: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }
}

interface Point {
  x: number,
  y: number
}
