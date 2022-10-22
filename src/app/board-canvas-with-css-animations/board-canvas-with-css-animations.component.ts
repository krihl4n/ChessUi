import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ECDH } from 'crypto';
import { threadId } from 'worker_threads';
import { DrawingService } from '../board-canvas/drawing.service';
import { FieldUtilsService } from '../board-canvas/field-utils.service';
import { BoardSetup } from './board-setup';
import { CoordinationsUtil } from './coordinations-utils';
import { HtmlPieceReneder } from './html-piece-renderer';
import { Piece } from './piece.model';
import { Pieces } from './pieces';

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

  canvasSize: number;
  private fieldColorLight = "#D2C3C3";
  private fieldColorDark = "#75352B";
  private boardFlipped = false;
  private boardSetup: BoardSetup;

  readyForDrawing = false
  
  private htmlPieceRender: HtmlPieceReneder

  private pieces = new Pieces()
  private fieldOccupations = new Map<string, Piece>() 

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.boardSetup = new BoardSetup(false, window.outerHeight)
    this.canvasSize = this.boardSetup.boardSize
    this.locationUtilsService.initialize(this.boardFlipped, this.boardSetup.fieldSize)
    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
    this.pieces.initialize(() => {
      this.readyForDrawing = true
      this.fieldOccupations.set("h3", this.pieces.whiteBishop)
      this.fieldOccupations.set("a2", this.pieces.blackBishop)
    })

    this.testPieceMovement()

    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      let leftClick = 0; // todo check other OSes

      if (e.button == leftClick) {
        const {x, y} = CoordinationsUtil.convertAbsoluteToBoardRelativeCoords(e.x, e.y, this.boardContainer)
        const field = this.fieldUtils.determineFieldAtPos(x, y, this.boardSetup.fieldSize)
        const piece = this.fieldOccupations.get(field)

        if(piece) {
          this.pieceDraggedFromField = field
          this.draggedPiece = piece
          this.fieldOccupations.delete(field)
          this.htmlPieceRender.renderDraggedPiece(e.x, e.y, this.draggedPiece)
        }
      }
    })

    window.addEventListener('mouseup', (e: MouseEvent) => {
      const {x, y} = CoordinationsUtil.convertAbsoluteToBoardRelativeCoords(e.x, e.y, this.boardContainer)
      const field = this.fieldUtils.nullableDetermineFieldAtPos(x, y, this.boardSetup.fieldSize)

      if(this.draggedPiece) {
        if(!field) {
          this.fieldOccupations.set(this.pieceDraggedFromField, this.draggedPiece)
        } else {
          this.fieldOccupations.set(field, this.draggedPiece)
        }
        this.draggedPiece = null
        this.htmlPieceRender.clearDraggedPiece()
      }
    })

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if(this.draggedPiece) {
        this.htmlPieceRender.renderDraggedPiece(e.x, e.y, this.draggedPiece)
      }
    })

    window.requestAnimationFrame(this.drawEverything.bind(this));
  }

  private pieceDraggedFromField: string
  private draggedPiece: Piece | null

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.boardSetup.windowHeightUpdated(window.outerHeight)
    this.locationUtilsService.initialize(this.boardFlipped, this.boardSetup.fieldSize)
    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
  }
  
  private testPieceMovement() {
    let from1 = "a2"
    let to1 = "h2"

    let from2 = "h3"
    let to2 = "a3"
    setInterval(() => {
      const piece1 = this.fieldOccupations.get(from1) 
      this.fieldOccupations.delete(from1)
      this.htmlPieceRender.renderPieceMovement(from1, to1, piece1, (piece) => {
        this.fieldOccupations.set(to1, piece)
        let tmp = from1
        from1 = to1
        to1 = tmp
      })

      const piece2 = this.fieldOccupations.get(from2) 
      this.fieldOccupations.delete(from2)
      this.htmlPieceRender.renderPieceMovement(from2, to2, piece2, (piece) => {
        this.fieldOccupations.set(to2, piece)
        let tmp = from2
        from2 = to2
        to2 = tmp
      })
    }, 3000)
  }

  onBoardClicked(event: Event) {
    const e: PointerEvent = event as PointerEvent
    const {x, y} = CoordinationsUtil.convertAbsoluteToBoardRelativeCoords(e.x, e.y, this.boardContainer)
    const field = this.fieldUtils.determineFieldAtPos(x, y, this.boardSetup.fieldSize)
    console.log(field)
  }

  private drawEverything() {
    this.drawBackground();

    if(this.readyForDrawing) {
      let factor = 1.0
      this.fieldOccupations.forEach((piece, field) => {
        const pieceLocation = this.fieldUtils.determinePieceLocationAtField(field, this.boardSetup.fieldSize)
        const pieceImage = piece.image
        this.canvasContext.drawImage(pieceImage, pieceLocation.x, pieceLocation.y, pieceImage.width * factor, pieceImage.height * factor) // todo just use html rendering?
      })
    }
    
    window.requestAnimationFrame(this.drawEverything.bind(this))
  }

  private drawBackground() {
    
    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.boardSetup.fieldSize;
        let rowPos = row * this.boardSetup.fieldSize;
        this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.boardSetup.fieldSize, this.boardSetup.fieldSize, currentColor)

        if (col == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineRowAtPos(rowPos, this.boardSetup.fieldSize),
            this.oppositeOf(currentColor),
            colPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.1,
            rowPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.85,
            Math.floor(this.boardSetup.fieldSize / 6));
        }
        if (row == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineColAtPos(colPos, this.boardSetup.fieldSize),
            this.oppositeOf(currentColor),
            colPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.95,
            rowPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.05,
            Math.floor(this.boardSetup.fieldSize / 6));
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
