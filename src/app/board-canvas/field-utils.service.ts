import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FieldUtilsService {

  private fieldSize: number;
  private boardFlipped: boolean;
  

  initialize(boardFlipped: boolean, fieldSize: number) { // figure out a better way
    this.fieldSize = fieldSize;
    this.boardFlipped = boardFlipped;
  }

  determineFieldAtPos(x: number, y: number) {
    return this.determineColAtPos(x) + this.determineRowAtPos(y);
  }

  determineRowAtPos(y: number): string {
    let rows = ['8', '7', '6', '5', '4', '3', '2', '1']

    if (this.boardFlipped) {
      rows.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (y >= i * this.fieldSize && y < i * this.fieldSize + this.fieldSize) {
        return rows[i]
      }
    }
    return "x";
  }

  determineColAtPos(x: number): string {
    let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    if (this.boardFlipped) {
      cols.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (x >= i * this.fieldSize && x < i * this.fieldSize + this.fieldSize) {
        return cols[i]
      }
    }
    return "x";
  }
}
