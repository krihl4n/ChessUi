import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameEventsService } from '../services/game-events.service';
import { GameInfoService } from '../services/game-info.service';
import { GameService } from '../services/game.service';
import { StartGameDialogComponent } from '../start-game-dialog/start-game-dialog.component';
import { CapturesService } from './captures/captures.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  private waitingForPlayersEventSubscription: Subscription
  private rematchRequestedSubscription: Subscription
  constructor(
    private dialog: MatDialog,
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private gameEventsService: GameEventsService,
    private gameInfoService: GameInfoService,
    private capturesService: CapturesService
  ) { }

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

    this.waitingForPlayersEventSubscription = this.gameEventsService.getWaitingForOtherPlayersObservable().subscribe((gameId: string) => {
      this.router.navigate(['/game', gameId])
    })

    this.rematchRequestedSubscription = this.gameEventsService.getRematchRequestedObservable().subscribe((gameId: string) => {
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
    this.gameService.joinExistingGame(gameId)
  }

  playerHasCaptures() {
    return this.capturesService.playerHasCaptures(this.gameInfoService.getPlayerColor())
  }
}

// https://blog.angular-university.io/angular-material-dialog/