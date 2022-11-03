import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StartGameDialogComponent } from '../start-game-dialog/start-game-dialog.component';

@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game2.component.css']
})
export class Game2Component implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog() {
    this.dialog.open(StartGameDialogComponent, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: false,
      width: "767px",
      height: "415px",
      panelClass: 'custom-modalbox'
    })
  }
}

// https://blog.angular-university.io/angular-material-dialog/