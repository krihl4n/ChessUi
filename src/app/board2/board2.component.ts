import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { DrawingService } from './tools/drawing.service';
import { FieldUtilsService } from './tools//field-utils.service';
import { PiecesLocations } from './tools//pieces-locations';
import { Point } from './tools//point.model';
import { BoardSetup } from './tools/board-setup';
import { CoordinationsUtil } from './tools/coordinations-utils';
import { HtmlPieceReneder } from './tools/html-piece-renderer';
import { PieceDragHandler } from './tools/piece-drag-handler';
import { PieceMoveHandler } from './tools/piece-move-handler';
import { Piece } from './tools/piece.model';
import { Pieces } from './tools/pieces';
import { MarkAndMoveHandler } from './tools/mark-and-move-handler';

@Component({
  selector: 'app-board-2',
  templateUrl: './board2.component.html',
  styleUrls: ['./board2.component.css']
})
export class Board2Component implements OnInit {

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
  private piecesLocations = new PiecesLocations()
  private dragHandler: PieceDragHandler;
  private pieceMoveHandler: PieceMoveHandler
  private markAndMoveHandler: MarkAndMoveHandler

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.boardSetup = new BoardSetup(false, window.outerHeight)
    this.canvasSize = this.boardSetup.boardSize
    this.locationUtilsService.initialize(this.boardFlipped, this.boardSetup.fieldSize)
    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
    this.dragHandler = new PieceDragHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender)
    this.pieceMoveHandler = new PieceMoveHandler(this.piecesLocations, this.htmlPieceRender)
    this.markAndMoveHandler = new MarkAndMoveHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender)

    this.dragHandler.registerPieceMovementListener(this.markAndMoveHandler.pieceMovedListener.bind(this.markAndMoveHandler))
    this.pieces.initialize()

    this.piecesLocations.set("h8", this.pieces.whiteBishop)
    this.piecesLocations.set("a2", this.pieces.blackBishop)
    this.piecesLocations.set("b2", this.pieces.whiteBishop2)
    this.piecesLocations.set("c2", this.pieces.blackBishop2)
    this.renderPieces()
   // this.testPieceMovement()

    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      let leftClick = 0; // todo check other OSes
      if (e.button == leftClick) {
        this.dragHandler.notifyMouseDownOnPieceEvent(this.getEventLocationOnBoard(e))
      }
    })

    window.addEventListener('mousedown', (e: MouseEvent) => {
      this.markAndMoveHandler.notifyMouseDownEvent()
    })

    window.addEventListener('mouseup', (e: MouseEvent) => {
      this.dragHandler.notifyMouseUpEvent(this.getEventLocationOnBoard(e))
      this.markAndMoveHandler.notifyMouseUpEvent(this.getEventLocationOnBoard(e))
    })

    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.dragHandler.notifyMouseMove(this.getEventLocationOnBoard(e))
    })

    window.requestAnimationFrame(this.drawEverything.bind(this));
  }

  renderPieces() {
    this.piecesLocations.getAll().forEach((piece, field) => {
        this.htmlPieceRender.renderPieceAtField(field, piece)
        piece.setMouseDownListener(this.notifyPieceClicked.bind(this))
    })
  }

  notifyPieceClicked(e: MouseEvent, piece: Piece) {
      let leftClick = 0; // todo check other OSes
      if (e.button == leftClick) {
        this.dragHandler.notifyMouseDownOnPieceEvent(this.getEventLocationOnBoard(e), piece)
      }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.boardSetup.windowHeightUpdated(window.outerHeight)
    this.locationUtilsService.initialize(this.boardFlipped, this.boardSetup.fieldSize)
    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
  }
  
  private testPieceMovement() {
    let from1 = "a2"
    let to1 = "h2"

    let from2 = "h8"
    let to2 = "a1"

    setInterval(() => {
      this.pieceMoveHandler.movePiece(from1, to1)
      this.pieceMoveHandler.movePiece(from2, to2)

      let tmp = from1
      from1 = to1
      to1 = tmp
      tmp = from2
      from2 = to2
      to2 = tmp
    }, 3000)
  }

  private getEventLocationOnBoard(e: MouseEvent): Point {
    return CoordinationsUtil.convertAbsoluteToBoardRelativeCoords(e.x, e.y, this.boardContainer);
  }

  private drawEverything() {
    this.drawBackground();
    window.requestAnimationFrame(this.drawEverything.bind(this))
  }

  private drawBackground() {
    
    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.boardSetup.fieldSize;
        let rowPos = row * this.boardSetup.fieldSize;
        const field = this.fieldUtils.determineFieldAtPos({x: colPos, y: rowPos}, this.boardSetup.fieldSize)
        if(field && this.markAndMoveHandler.fieldIsMarked(field)) {
          this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.boardSetup.fieldSize, this.boardSetup.fieldSize, "#FF0000")
        } else {
          this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.boardSetup.fieldSize, this.boardSetup.fieldSize, currentColor)
        }

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
