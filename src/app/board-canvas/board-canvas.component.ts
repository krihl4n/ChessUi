import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  private boardSize = this.canvasSize
  private fieldColorLight = "#EBD1A6";
  private fieldColorDark = "#A27551";

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    let framesPerSecond = 30;
    setInterval(this.drawEverything.bind(this), 1000 / framesPerSecond);
  }

  private drawEverything() {
    this.drawBackground()
  }

  private drawBackground() {
    let fieldSize = this.boardSize / 8;

    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        this.fillRectangle(col * fieldSize, row * fieldSize, fieldSize, fieldSize, currentColor)
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

  private fillRectangle(x: number, y: number, w: number, h: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }
}
