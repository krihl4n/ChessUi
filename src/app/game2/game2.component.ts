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
    const dialogRef = this.dialog.open(StartGameDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      position: { top: "140px" },
      minWidth: "331px",
      // height: "313px",
      panelClass: 'custom-modalbox',
      backdropClass: 'cutom-modal-backdrop'
    })

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output: " + JSON.stringify(data))
    )
  }
}

// https://blog.angular-university.io/angular-material-dialog/