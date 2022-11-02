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

    const dialogConfig = new MatDialogConfig();

    // const dialogConfig = {
    //   disableClose: false;
    // }.
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = "767px"
    // dialogConfig.height = "415px"
    
    this.dialog.open(StartGameDialogComponent, {
      disableClose: false,
      autoFocus: true,
      width: "767px",
      height: "415px",
      panelClass: 'custom-modalbox'
    })
  }
}

// https://blog.angular-university.io/angular-material-dialog/