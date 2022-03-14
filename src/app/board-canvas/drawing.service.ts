import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

  private context: CanvasRenderingContext2D;

  constructor() { }

  setCanvasContext(context: CanvasRenderingContext2D | null) {
    if(!context == null) {
      console.error("Cannot initialize canvas context");
    }
    this.context = context as CanvasRenderingContext2D;
  }

  clearEverything() {
    this.context.clearRect(0, 0, 700, 700);
  }

  fillRectangle(x: number, y: number, w: number, h: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }

  fillText(txt: string, color: string, x: number, y: number) {
    this.context.fillStyle = color;
    this.context.font = "12px Georgia"; // todo scale 
    this.context.fillText(txt, x, y);
  }

  drawPicture(pic: HTMLImageElement, x: number, y: number) {
    this.context.save();
    this.context.translate(x, y);
    this.context.drawImage(pic, 0, 0);
    this.context.restore();
  }

  fillCircle(x:number, y:number, radius:number, color:string) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context.fill();
  }
}