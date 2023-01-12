import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game.service';
import { StartGameDialogComponent } from '../start-game-dialog/start-game-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private dialog: MatDialog, private gameService: GameService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.params['id']
    if(gameId) {
      this.joinExistingGame(gameId)
    } else {
      this.openDialog()
    }
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
      data => this.gameService.initiateNewGame(data.selectedMode, data.selectedColor)
    )
  }

  joinExistingGame(gameId: string) {
    debugger
    this.gameService.joinExistingGame(gameId)
  }
}

// https://blog.angular-university.io/angular-material-dialog/