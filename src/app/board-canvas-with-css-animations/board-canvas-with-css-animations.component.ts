import { AfterContentInit, AfterViewInit, Component, ComponentFactoryResolver, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { DrawingService } from '../board-canvas/drawing.service';
import { FieldUtilsService } from '../board-canvas/field-utils.service';
import { ChessPieceComponent } from './chess-piece/chess-piece.component';

@Component({
  selector: 'app-board-canvas-with-css-animations',
  templateUrl: './board-canvas-with-css-animations.component.html',
  styleUrls: ['./board-canvas-with-css-animations.component.css']
})
export class BoardCanvasWithCssAnimationsComponent implements OnInit, AfterViewInit {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private drawingService: DrawingService, 
    private locationUtilsService: FieldUtilsService,
    private renderer: Renderer2) { }

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

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.setupBoardSize(window.outerHeight)
    this.locationUtilsService.initialize(this.boardFlipped, this.fieldSize)
    window.requestAnimationFrame(this.drawEverything.bind(this));
  }

  ngAfterViewInit(): void {
    
    // const factory = this.componentFactoryResolver.resolveComponentFactory(ChessPieceComponent)
    // const componentRef = this.container.createComponent(factory)

    //  const el = document.createElement("img");
    //  el.setAttribute('src', 'assets/white_bishop.svg')
    //  el.setAttribute('left', "200px")
    //  document.getElementById("boardcontainter")?.appendChild(el)

    const el = this.renderer.createElement('img')
    this.renderer.setAttribute(el, 'id', 'white_bishop');
    this.renderer.setAttribute(el, 'src', 'assets/white_bishop.svg');
    this.renderer.setStyle(el, 'left', this.leftPos)
    this.renderer.listen(el, 'click', (evt) => {
      console.log("image clicked")
      this.onImageClick()
      this.renderer.setStyle(el, 'left', this.leftPos)
    })
    
    this.renderer.appendChild(this.boardContainer.nativeElement, el)
    const el1 = this.renderer.createElement('img')
    this.renderer.setAttribute(el1, 'id', 'black_bishop');
    this.renderer.setAttribute(el1, 'src', 'assets/black_bishop.svg');
    this.renderer.setStyle(el1, 'left', this.leftPos1)
    this.renderer.listen(el1, 'click', (evt) => {
      console.log("image clicked")
      this.onImageClick1()
      this.renderer.setStyle(el1, 'left', this.leftPos1)
    })

    this.renderer.appendChild(this.boardContainer.nativeElement, el1)
    this.renderer.listen("document", 'animationend', () => {
      console.log("animation")
    })
    this.renderer.listen(el1, 'mousedown', () => {
      console.log("mousedown")
    })
    this.renderer.selectRootElement
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setupBoardSize(window.outerHeight)
  }

  leftPos="100px"
  leftPos1="200px"
  onImageClick() {
    console.log("click")
    if(this.leftPos === "100px") {
      this.leftPos = "500px"; 
    } else {
      this.leftPos = "100px"
    }
  }

  onImageClick1() {
    console.log("click1")
    if(this.leftPos1 === "200px") {
      this.leftPos1 = "300px"; 
    } else {
      this.leftPos1 = "200px"
    }
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
