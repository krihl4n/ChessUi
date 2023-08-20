import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameControlService } from 'src/app/services/game-control.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-rematch',
  templateUrl: './rematch.component.html',
  styleUrls: ['./rematch.component.css']
})
export class RematchComponent implements OnInit, OnDestroy {

  private gameResultSubscription: Subscription
  private shouldBeVisible = false

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameResultSubscription = this.gameService.getGameFinishedObservable().subscribe(result => {
      this.shouldBeVisible = true
    })
  }

  ngOnDestroy(): void {
    this.gameResultSubscription?.unsubscribe()
  }

  visible() {
    return this.shouldBeVisible
  }

  rematch() {
    this.gameService.rematch()    
  }
}
