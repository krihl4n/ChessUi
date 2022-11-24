import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-start-game-dialog',
  templateUrl: './start-game-dialog.component.html',
  styleUrls: ['./start-game-dialog.component.scss']
})
export class StartGameDialogComponent {

  constructor(private dialogRef: MatDialogRef<StartGameDialogComponent>) { }

  isWhiteColorSelected = false
  isRandomColorSelected = false
  isBlackColorSelected = false
  isComputerSelected = false
  isFriendSelected = false

  whiteColorSelected() {
    this.isWhiteColorSelected = true
    this.isBlackColorSelected = false
    this.isRandomColorSelected = false
    this.closeIfPossible()
  }

  randomColorSelected() {
    this.isRandomColorSelected = true
    this.isWhiteColorSelected = false
    this.isBlackColorSelected = false
    this.closeIfPossible()
  }

  blackColorSelected() {
    this.isBlackColorSelected = true
    this.isWhiteColorSelected = false
    this.isRandomColorSelected = false
    this.closeIfPossible()
  }

  computerSelected() {
    this.isComputerSelected = true
    this.isFriendSelected = false
    this.closeIfPossible()
  }

  friendSelected() {
    this.isFriendSelected = true
    this.isComputerSelected = false
    this.closeIfPossible()
  }

  private closeIfPossible() {
    if (this.colorSelected() && this.modeSelected()) {
      this.dialogRef.close({
        selectedMode: this.determineSelectedMode(),
        selectedColor: this.determineSelectedColor()
      })
    }
  }

  private colorSelected(): Boolean {
    return this.isWhiteColorSelected || this.isBlackColorSelected || this.isRandomColorSelected
  }

  private modeSelected(): Boolean {
    return this.isComputerSelected || this.isFriendSelected
  }

  private determineSelectedColor(): string {
    if (this.isWhiteColorSelected) return "white"
    if (this.isBlackColorSelected) return "black"
    return "random"
  }

  private determineSelectedMode(): string {
    if (this.isFriendSelected) return "friend"
    else return "computer"
  }
}
