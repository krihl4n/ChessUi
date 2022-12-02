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
import { GameService } from '../services/game.service';
import { FieldOccupation } from '../model/field-occupation.model';

@Component({
  selector: 'app-board-2',
  templateUrl: './board2.component.html',
  styleUrls: ['./board2.component.css']
})
export class Board2Component implements OnInit {

  constructor(
    private drawingService: DrawingService,
    private renderer: Renderer2,
    private fieldUtils: FieldUtilsService,
    private gameService: GameService) { }

  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  canvasContext: CanvasRenderingContext2D;

  @ViewChild('boardcontainer', { static: true })
  boardContainer: ElementRef<HTMLCanvasElement>;

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  canvasSize: number;
  private lightFieldColor = "#D2C3C3";
  private darkFieldColor = "#75352B";
  private markedFieldColor = "#4F7B64";
  private markedFieldAlpha = 0.8;
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
    this.boardSetup = new BoardSetup(false, this.boardContainer.nativeElement.offsetHeight)
    this.canvasSize = this.boardSetup.boardSize
    this.fieldUtils.initialize(this.boardSetup.boardFlipped, this.boardSetup.fieldSize)
    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
    this.dragHandler = new PieceDragHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender)
    this.pieceMoveHandler = new PieceMoveHandler(this.piecesLocations, this.htmlPieceRender, this.gameService)
    this.markAndMoveHandler = new MarkAndMoveHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender, this.gameService)

    this.pieces.initialize(this.boardSetup)
    this.htmlPieceRender.preRenderPieces(this.pieces.availablePieces)

    this.gameService.fieldOccupationChange // maybe also get initial position (race condition)
      .subscribe((positions: FieldOccupation[]) => { // todo unsubscribe?
        console.log("POSITIONS RECEIVED")
        positions.forEach(fieldOccupation => {
          if(fieldOccupation.piece) {
            const pieceElement = this.pieces.getPiece(fieldOccupation.piece.color, fieldOccupation.piece.type)
            if(pieceElement) {
              this.piecesLocations.set(
                fieldOccupation.field,
                pieceElement 
              )
            }
          }
        })
        this.renderPieces()        
        // this.htmlPieceRender.preRenderPieces(Array.from(this.piecesLocations.getAll().values()), () => {
        //   this.renderPieces()
        // })
      })
    
    //this.testPieceMovement()

    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault()
      let leftClick = 0; // todo check other OSes
      if (e.button == leftClick) {
        this.markAndMoveHandler.notifyMouseDownEvent(this.getEventLocationOnBoard(e))
        this.dragHandler.notifyMouseDownEvent(this.getEventLocationOnBoard(e))
      }
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
    e.preventDefault()
    let leftClick = 0; // todo check other OSes
    if (e.button == leftClick) {
      this.markAndMoveHandler.notifyMouseDownEvent(this.getEventLocationOnBoard(e))
      this.dragHandler.notifyMouseDownEvent(this.getEventLocationOnBoard(e), piece)
    }
  }

  // probably not needed implementing adding css grid 
  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   console.log("resize")
  //   this.boardSetup.containerSizeUpdated(this.boardContainer.nativeElement.clientHeight)
  //   this.canvasSize = this.boardSetup.boardSize
  //   this.fieldUtils.initialize(this.boardSetup.boardFlipped, this.boardSetup.fieldSize)
  //   this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
  //   this.dragHandler = new PieceDragHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender)
  //   this.pieceMoveHandler = new PieceMoveHandler(this.piecesLocations, this.htmlPieceRender)
  //   this.markAndMoveHandler = new MarkAndMoveHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender)
  //   this.htmlPieceRender.resizePieces(Array.from(this.piecesLocations.getAll().values()))
  //   this.renderPieces()
  // }

  private testPieceMovement() {
    let from1 = "a2"
    let to1 = "a4"

    let from2 = "g8"
    let to2 = "f6"

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

    let currentColor = this.lightFieldColor;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.boardSetup.fieldSize;
        let rowPos = row * this.boardSetup.fieldSize;
        const field = this.fieldUtils.determineFieldAtPos({ x: colPos, y: rowPos }, this.boardSetup.fieldSize)
        if (field) {
          this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.boardSetup.fieldSize, this.boardSetup.fieldSize, currentColor)
          if (this.markAndMoveHandler.fieldIsMarked(field)) {
            this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.boardSetup.fieldSize, this.boardSetup.fieldSize, this.markedFieldColor, this.markedFieldAlpha)
          }
        }

        if (col == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.fieldUtils.determineRowAtPos(rowPos, this.boardSetup.fieldSize),
            this.oppositeOf(currentColor),
            colPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.1,
            rowPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.85,
            Math.floor(this.boardSetup.fieldSize / 6));
        }
        if (row == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.fieldUtils.determineColAtPos(colPos, this.boardSetup.fieldSize),
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
    if (color == this.lightFieldColor) {
      return this.darkFieldColor
    } else {
      return this.lightFieldColor
    }
  }
}
