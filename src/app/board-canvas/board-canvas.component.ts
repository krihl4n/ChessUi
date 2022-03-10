import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.css']
})
export class BoardCanvasComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private canvasContext: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    let framesPerSecond = 30;
    setInterval(this.drawEverything.bind(this), 1000 / framesPerSecond);
  }

  private drawEverything() {
    this.canvasContext.fillStyle = 'red';
    this.canvasContext.fillRect(0, 0, 50, 50);
  }

}
