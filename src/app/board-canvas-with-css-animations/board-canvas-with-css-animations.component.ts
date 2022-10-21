import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { DrawingService } from '../board-canvas/drawing.service';
import { FieldUtilsService } from '../board-canvas/field-utils.service';

@Component({
  selector: 'app-board-canvas-with-css-animations',
  templateUrl: './board-canvas-with-css-animations.component.html',
  styleUrls: ['./board-canvas-with-css-animations.component.css']
})
export class BoardCanvasWithCssAnimationsComponent implements OnInit {

  constructor(
    private drawingService: DrawingService, 
    private locationUtilsService: FieldUtilsService,
    private renderer: Renderer2,
    private fieldUtils: FieldUtilsService) { }

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef;

  canvasContext: CanvasRenderingContext2D;

  @ViewChild('boardcontainer', { static: true }) 
  boardContainer: ElementRef<HTMLCanvasElement>;

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private fieldSize: number;
  canvasSize: number;
  private fieldColorLight = "#D2C3C3";
  private fieldColorDark = "#75352B";
  private boardFlipped = false;

  loaded = false
  image = new Image();

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.setupBoardSize(window.outerHeight)
    this.locationUtilsService.initialize(this.boardFlipped, this.fieldSize)

    this.image.onload = () => {
      this.loaded = true
      console.log("image loaded")
    }
    this.image.src = 'assets/white_bishop.svg'

    const myImg = this.renderer.createElement('img');
    this.renderer.setAttribute(myImg, 'src', "assets/white_bishop.svg")
    this.renderer.setAttribute(myImg, 'draggable', 'false')
    
    setTimeout(() => {
      const pieceLocation = this.fieldUtils.determinePieceLocationAtField("b3", this.fieldSize)
      this.renderer.setStyle(myImg, 'left', pieceLocation.x + 'px')
      this.renderer.setStyle(myImg, 'top', pieceLocation.y + 'px')
  
      this.renderer.appendChild(this.boardContainer.nativeElement, myImg)
    }, 1000)

    setTimeout(() => {
      const pieceLocation = this.fieldUtils.determinePieceLocationAtField("h3", this.fieldSize)
      this.renderer.setStyle(myImg, 'left', pieceLocation.x + 'px')
      this.renderer.setStyle(myImg, 'top', pieceLocation.y + 'px')
    }, 2000)

    setTimeout(() => {
      this.renderer.removeChild(this.boardContainer.nativeElement, myImg)
    }, 4000)

    window.requestAnimationFrame(this.drawEverything.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setupBoardSize(window.outerHeight)
  }
  
  onBoardClicked(event: Event) {
    const e: PointerEvent = event as PointerEvent
    const {x, y} = this.boardContainer.nativeElement.getBoundingClientRect(); // position of board container
    const boardX = e.x - x;
    const boardY = e.y - y;
    const field = this.fieldUtils.determineFieldAtPos(boardX, boardY, this.fieldSize)
    console.log(field)
  }

  private setupBoardSize(windowHeight: number) {
    this.fieldSize = (windowHeight-200)/8
    this.canvasSize = this.fieldSize*8  // scale pieces as well?
  }

  private drawEverything() {
    this.drawBackground();

    if(this.loaded) {
      let factor = 1.0
      const pieceLocation = this.fieldUtils.determinePieceLocationAtField("b3", this.fieldSize)
      this.canvasContext.drawImage(this.image, pieceLocation.x, pieceLocation.y, this.image.width * factor, this.image.height * factor)
    }
    
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
            this.oppositeOf(currentColor),
            colPos + this.fieldSize - this.fieldSize * 0.1,
            rowPos + this.fieldSize - this.fieldSize * 0.85,
            Math.floor(this.fieldSize / 6));
        }
        if (row == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineColAtPos(colPos, this.fieldSize),
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
