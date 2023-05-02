import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { DrawingService } from './tools/drawing.service';
import { FieldUtilsService } from './tools/field-utils.service';
import { PiecesLocations } from './tools/pieces-locations';
import { Point } from './tools/point.model';
import { BoardSetup } from './tools/board-setup';
import { CoordinationsUtil } from './tools/coordinations-utils';
import { HtmlPieceReneder } from './tools/html-piece-renderer';
import { PieceDragHandler } from './tools/move-handlers/drag-and-drop-handler';
import { AsyncMoveHandler } from './tools/move-handlers/async-move-handler';
import { Piece } from './tools/piece.model';
import { Pieces } from './tools/pieces';
import { MarkAndMoveHandler } from './tools/move-handlers/mark-and-move-handler';
import { GameService } from '../services/game.service';
import { FieldOccupation } from '../model/field-occupation.model';
import { GameStartEvent } from '../model/game-start-event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  constructor(
    private drawingService: DrawingService,
    private renderer: Renderer2,
    private fieldUtils: FieldUtilsService,
    private gameService: GameService,
    private piecesLocations: PiecesLocations) { }

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
  private markedFieldAlpha = 0.9;
  private lastMoveFieldColor = "#938864";
  private lastMoveFieldAlpha = 0.8;
  private boardSetup: BoardSetup;

  readyForDrawing = false

  private htmlPieceRender: HtmlPieceReneder

  private pieces = new Pieces()
  private dragHandler: PieceDragHandler;
  private pieceMoveHandler: AsyncMoveHandler
  private markAndMoveHandler: MarkAndMoveHandler

  private fieldOccupationChange: Subscription
  private gameStartedEvent: Subscription

  ngOnInit(): void {
    this.initializeBoard()

    this.gameStartedEvent = this.gameService.getGameStartedEventObservable()
      .subscribe((gameStartEvent: GameStartEvent) => {
        if (gameStartEvent.playerColor == "BLACK") {
          this.boardSetup = new BoardSetup(true, this.boardContainer.nativeElement.offsetHeight)
          this.fieldUtils.initialize(true, this.boardSetup.fieldSize)
        } else {
          this.boardSetup = new BoardSetup(false, this.boardContainer.nativeElement.offsetHeight)
          this.fieldUtils.initialize(false, this.boardSetup.fieldSize)
        }

        this.fieldOccupationChange = this.gameService.getFieldOccupationChangeObservable() // maybe also get initial position, or use ReplaySubject
          .subscribe((positions: FieldOccupation[]) => { // todo unsubscribe?
            positions.forEach(fieldOccupation => {
              if (fieldOccupation.piece) {
                const pieceElement = this.pieces.getPiece(fieldOccupation.piece.color, fieldOccupation.piece.type)
                if (pieceElement) {
                  this.piecesLocations.set(
                    fieldOccupation.field,
                    pieceElement
                  )
                }
              }
            })
            setTimeout(() => {
              this.renderPieces()
            }, 100) // pieces not diplayed at proper locations fix.
            
            // this.htmlPieceRender.preRenderPieces(Array.from(this.piecesLocations.getAll().values()), () => {
            //   this.renderPieces()
            // })
          })

      })
  }

  ngOnDestroy(): void {
    this.markAndMoveHandler.cleanup()
    this.dragHandler.cleanup()
    this.pieceMoveHandler.cleanup()
    this.fieldOccupationChange?.unsubscribe()
    this.gameStartedEvent?.unsubscribe()
  }

  initializeBoard() {

    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.boardSetup = new BoardSetup(false, this.boardContainer.nativeElement.offsetHeight)
    this.canvasSize = this.boardSetup.boardSize
    this.fieldUtils.initialize(false, this.boardSetup.fieldSize)

    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize, this)
    this.dragHandler = new PieceDragHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender, this.gameService)
    this.pieceMoveHandler = new AsyncMoveHandler(this.piecesLocations, this.htmlPieceRender, this.gameService)
    this.markAndMoveHandler = new MarkAndMoveHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender, this.gameService)

    this.pieces.initialize(this.boardSetup.fieldSize)
    this.htmlPieceRender.preRenderPieces(this.pieces.availablePieces)

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
      //piece.setMouseDownListener(this.notifyPieceClicked.bind(this)) // moved to renderer 
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
          if (this.gameService.lastMove?.from == field || this.gameService.lastMove?.to == field) {
            this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.boardSetup.fieldSize, this.boardSetup.fieldSize, this.lastMoveFieldColor, this.lastMoveFieldAlpha)
          }
          if (this.markAndMoveHandler.fieldIsMarkedForPossibleMove(field)) {
            if (this.piecesLocations.fieldOccupied(field)) {
              const size = this.boardSetup.fieldSize * 0.25
              const offset = 0.25
              this.drawingService.fillTriangle(this.canvasContext, colPos + offset, rowPos + offset, 1, 1, size, this.markedFieldColor)
              this.drawingService.fillTriangle(this.canvasContext, colPos + this.boardSetup.fieldSize - offset, rowPos + offset, -1, 1, size, this.markedFieldColor)
              this.drawingService.fillTriangle(this.canvasContext, colPos + offset, rowPos + this.boardSetup.fieldSize - offset, 1, -1, size, this.markedFieldColor)
              this.drawingService.fillTriangle(this.canvasContext, colPos + this.boardSetup.fieldSize - offset, rowPos + this.boardSetup.fieldSize - offset, -1, -1, size, this.markedFieldColor)
            } else {
              this.drawingService.fillCircle(
                this.canvasContext,
                colPos + this.boardSetup.fieldSize / 2,
                rowPos + this.boardSetup.fieldSize / 2,
                this.boardSetup.fieldSize / 6,
                this.markedFieldColor,
                this.markedFieldAlpha)
            }
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
