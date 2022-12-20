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
  isHotSeatSelected = false
  isTestSelected = false

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
    this.isHotSeatSelected = false
    this.isTestSelected = false
    this.closeIfPossible()
  }

  friendSelected() {
    this.isFriendSelected = true
    this.isComputerSelected = false
    this.isHotSeatSelected = false
    this.isTestSelected = false
    this.closeIfPossible()
  }

  hotSeatSelected() {
    this.isFriendSelected = false
    this.isComputerSelected = false
    this.isHotSeatSelected = true
    this.isTestSelected = false
    this.closeIfPossible()
  }

  testSelected() {
    this.isFriendSelected = false
    this.isComputerSelected = false
    this.isHotSeatSelected = false
    this.isTestSelected = true
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
    return this.isComputerSelected || this.isFriendSelected || this.isHotSeatSelected || this.isTestSelected
  }

  private determineSelectedColor(): string | null {
    if (this.isWhiteColorSelected) return "white"
    if (this.isBlackColorSelected) return "black"
    return null
  }

  private determineSelectedMode(): string {
    if (this.isFriendSelected) return "vs_friend"
    if (this.isHotSeatSelected) return "hot_seat"
    if (this.isTestSelected) return "test_mode"
    else return "vs_computer"
  }
}
