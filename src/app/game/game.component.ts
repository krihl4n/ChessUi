import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameStartEvent } from '../model/game-start-event.model';
import { GameService } from '../services/game.service';
import { StartGameDialogComponent } from '../start-game-dialog/start-game-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  private waitingForPlayersEventSubscription: Subscription
  private rematchRequestedSubscription: Subscription
  constructor(private dialog: MatDialog, private gameService: GameService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.route.params.subscribe((params: Params) => {
      const gameId = params['id']
      if (gameId) {
        this.joinExistingGame(gameId)
      } else {
        this.openDialog()
      }
    })

    this.waitingForPlayersEventSubscription = this.gameService.getWaitinForPlayersObservable().subscribe((gameId: string) => {
      this.router.navigate(['/game', gameId])
    })

    this.rematchRequestedSubscription = this.gameService.getRematchRequestedObservable().subscribe((gameId: string) => {
      this.router.navigate(['/game', gameId])
    })
  }

  ngOnDestroy(): void {
    this.waitingForPlayersEventSubscription?.unsubscribe()
    this.rematchRequestedSubscription?.unsubscribe()
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
  }

  joinExistingGame(gameId: string) {
    this.gameService.joinExistingGame(gameId, this.gameService.colorPreference, null)
  }
}

// https://blog.angular-university.io/angular-material-dialog/