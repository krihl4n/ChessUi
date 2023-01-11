import { Injectable } from '@angular/core';
import { Piece } from './piece.model';
import { Point } from './point.model';

@Injectable({
  providedIn: 'root'
})
export class FieldUtilsService {

  private columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  private rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

  private fieldSize: number;
  private boardFlipped: boolean;
  
  initialize(boardFlipped: boolean, fieldSize: number) { // figure out a better way (maybe pass boardSetup object)
    this.fieldSize = fieldSize;
    this.boardFlipped = boardFlipped;
  }

  determinePieceLocationAtField(field: string, fieldSize: number, piece: Piece) : {x: number, y: number} {
    const fieldLocation = this.determineFieldLocation(field, fieldSize)
    return {
      x: (fieldLocation.x + this.fieldSize / 2) - piece.htmlElement.width / 2,
      y: fieldLocation.y + this.fieldSize* 0.96 - piece.htmlElement.height
    }   
  }

  determineFieldLocation(field: string, fieldSize: number): {x: number, y: number} {
    const col = field.charAt(0)
    let columnsCopy = this.columns.slice()
    if (this.boardFlipped) {
      columnsCopy.reverse();
    }
    const x = columnsCopy.indexOf(col) * fieldSize
    
    const row = field.charAt(1)
    let rowsCopy = this.rows.slice()
    if (this.boardFlipped) {
      rowsCopy.reverse();
    }
    const y = rowsCopy.indexOf(row) * fieldSize
    
    return {x, y}
  }

  determineFieldAtPos(point: Point, fieldSize: number = this.fieldSize): string | undefined {
    const field = this.determineColAtPos(point.x, fieldSize) + this.determineRowAtPos(point.y, fieldSize);
    if(field.includes('x')) {
      return
    }
    return field
  }

  depracatedDetermineFieldAtPos(x: number, y: number, fieldSize: number = this.fieldSize): string {
    return this.determineColAtPos(x, fieldSize) + this.determineRowAtPos(y, fieldSize);
  }

  determineRowAtPos(y: number, fieldSize: number = this.fieldSize): string {
    let rowsCopy = this.rows.slice()

    if (this.boardFlipped) {
      rowsCopy.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (y >= i * fieldSize && y < i * fieldSize + fieldSize) {
        return rowsCopy[i]
      }
    }
    return "x";
  }

  determineColAtPos(x: number, fieldSize: number = this.fieldSize): string {
    let columnsCopy = this.columns.slice()

    if (this.boardFlipped) {
      columnsCopy.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (x >= i * fieldSize && x < i * fieldSize + fieldSize) {
        return columnsCopy[i]
      }
    }
    return "x";
  }
}
