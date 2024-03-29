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

  drawRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, alpha: number = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4
    ctx.globalAlpha = alpha
    ctx.strokeRect(x + 2, y + 2, w-4, h-4);
    ctx.globalAlpha = 1
  }

  fillTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, xDir: number, yDir: number, size: number, color: string) {
    ctx.fillStyle = color
    ctx.strokeStyle = color;
    ctx.lineWidth = 4
    ctx.beginPath();
    ctx.lineTo(x + size * xDir, y)
    ctx.lineTo(x, y + size * yDir)
    ctx.lineTo(x, y)
    ctx.fill()
  }

  fillText(ctx: CanvasRenderingContext2D, txt: string, color: string, x: number, y: number, font: number) {
    ctx.fillStyle = color;
    ctx.font = font + "px Georgia"; // todo scale 
    ctx.fillText(txt, x, y);
  }

  drawPicture(ctx: CanvasRenderingContext2D, pic: HTMLImageElement, x: number, y: number) {
    ctx.drawImage(pic, x, y);
  }

  fillCircle(ctx: CanvasRenderingContext2D, x:number, y:number, radius:number, color:string, alpha: number = 1) {
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.globalAlpha = 1
  }
}