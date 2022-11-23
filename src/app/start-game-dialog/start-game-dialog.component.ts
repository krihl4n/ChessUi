import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-game-dialog',
  templateUrl: './start-game-dialog.component.html',
  styleUrls: ['./start-game-dialog.component.scss']
})
export class StartGameDialogComponent implements OnInit {

  constructor() { }

  isWhiteColorSelected = false
  isRandomColorSelected = false
  isBlackColorSelected = false
  isComputerSelected = false
  isFriendSelected = false

  ngOnInit(): void {
  }

  whiteColorSelected() {
    this.isWhiteColorSelected = true
    this.isBlackColorSelected = false
    this.isRandomColorSelected = false
  }
  
  randomColorSelected() {
    this.isRandomColorSelected = true
    this.isWhiteColorSelected = false
    this.isBlackColorSelected = false
  }
  
  blackColorSelected() {
    this.isBlackColorSelected = true
    this.isWhiteColorSelected = false
    this.isRandomColorSelected = false
  }
  
  computerSelected() {
    this.isComputerSelected = true
    this.isFriendSelected = false
  }
  
  friendSelected() {
    this.isFriendSelected = true
    this.isComputerSelected = false
  }
}
