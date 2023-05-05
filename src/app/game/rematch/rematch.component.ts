import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameControlService } from 'src/app/services/game-control.service';

@Component({
  selector: 'app-rematch',
  templateUrl: './rematch.component.html',
  styleUrls: ['./rematch.component.css']
})
export class RematchComponent implements OnInit, OnDestroy {

  private gameResultSubscription: Subscription
  private shouldBeVisible = false

  constructor(private gameConstrolService: GameControlService) {}

  ngOnInit(): void {
    this.gameResultSubscription = this.gameConstrolService.getGameResultSubscription().subscribe(result => {
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
    console.log("REMATCH")  
  }
}
