import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DrawingService } from '../board-canvas/drawing.service';
import { FieldUtilsService } from '../board-canvas/field-utils.service';

@Component({
  selector: 'app-board-canvas-with-css-animations',
  templateUrl: './board-canvas-with-css-animations.component.html',
  styleUrls: ['./board-canvas-with-css-animations.component.css']
})
export class BoardCanvasWithCssAnimationsComponent implements OnInit {

  constructor(private drawingService: DrawingService, private locationUtilsService: FieldUtilsService) { }

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  canvasContext: CanvasRenderingContext2D;

  private fieldSize: number;
  canvasSize: number;
  private fieldColorLight = "#D2C3C3";
  private fieldColorDark = "#75352B";
  private boardFlipped = false;

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.setupBoardSize(window.outerHeight)
    this.locationUtilsService.initialize(this.boardFlipped, this.fieldSize)
    window.requestAnimationFrame(this.drawEverything.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setupBoardSize(window.outerHeight)
  }

  private setupBoardSize(windowHeight: number) {
    this.fieldSize = (windowHeight-200)/8
    this.canvasSize = this.fieldSize*8  
  }

  private drawEverything() {
    this.drawBackground();
    window.requestAnimationFrame(this.drawEverything.bind(this))
  }

  private drawBackground() {
    
    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.fieldSize;
        let rowPos = row * this.fieldSize;
        this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.fieldSize, this.fieldSize, currentColor)

        if (col == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineRowAtPos(rowPos, this.fieldSize),
           // "a",
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.1,
            rowPos + this.fieldSize - this.fieldSize * 0.85,
            Math.floor(this.fieldSize / 6));
        }
        if (row == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineColAtPos(colPos, this.fieldSize),
           // "a",
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.95,
            rowPos + this.fieldSize - this.fieldSize * 0.05,
            Math.floor(this.fieldSize / 6));
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
