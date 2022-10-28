import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {


  clearEverything(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, 700, 700);
  }

  fillRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, alpha: number = 1) {
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1
  }

  fillText(ctx: CanvasRenderingContext2D, txt: string, color: string, x: number, y: number, font: number) {
    ctx.fillStyle = color;
    ctx.font = font + "px Georgia"; // todo scale 
    ctx.fillText(txt, x, y);
  }

  drawPicture(ctx: CanvasRenderingContext2D, pic: HTMLImageElement, x: number, y: number) {
    ctx.drawImage(pic, x, y);
  }

  fillCircle(ctx: CanvasRenderingContext2D, x:number, y:number, radius:number, color:string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
  }
}