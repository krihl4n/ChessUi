import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-finished-dialog',
  templateUrl: './game-finished-dialog.component.html',
  styleUrls: ['./game-finished-dialog.component.css']
})
export class GameFinishedDialogComponent {

  displayStyle = "block";

  constructor() { }

  closeDialog(): void {
    this.displayStyle = "none"
  }
}
