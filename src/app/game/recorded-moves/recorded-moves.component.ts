import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PiecePositionUpdate } from 'src/app/model/piece-position-update.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-recorded-moves',
  templateUrl: './recorded-moves.component.html',
  styleUrls: ['./recorded-moves.component.css']
})
export class RecordedMovesComponent implements OnInit, OnDestroy {

  moves: string[] = []
  private positionChangeSubscription: Subscription
  
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.positionChangeSubscription = this.gameService.getPiecePositionChangeObservable()
    .subscribe((update: PiecePositionUpdate) => {
      this.moves.push(update.label)
    })
  }

  ngOnDestroy(): void {
    this.positionChangeSubscription?.unsubscribe()
  }

}
