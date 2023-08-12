import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameStartEvent } from 'src/app/model/game-start-event.model';
import { PiecePositionUpdate } from 'src/app/model/piece-position-update.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-recorded-moves',
  templateUrl: './recorded-moves.component.html',
  styleUrls: ['./recorded-moves.component.css']
})
export class RecordedMovesComponent implements OnInit, OnDestroy {

  moves: {white: string, black: string | null}[] = []
  private positionChangeSubscription: Subscription
  private gameStartedSubscription: Subscription
  
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.positionChangeSubscription = this.gameService.getPiecePositionChangeObservable()
    .subscribe((update: PiecePositionUpdate) => {
      if(update.reverted) {
        this.pop()
      } else {
        this.push(update.label)
      }
    })

    this.gameStartedSubscription = this.gameService.getGameStartedEventObservable()
    .subscribe((gameStarted: GameStartEvent) => {
      gameStarted.recordedMoves.forEach((move: string) => {
        this.push(move)
      })
    })
  }

  push(label: string) {
    let lastMove = this.moves[this.moves.length - 1]
    if(lastMove && !lastMove.black) {
      this.moves[this.moves.length - 1] = {white: lastMove.white, black: label}
    } else {
      this.moves.push({white: label, black: null})
    }
  }

  pop() {
    let lastMove = this.moves[this.moves.length - 1]
    if(lastMove && lastMove.black) {
      this.moves[this.moves.length - 1] = {white: lastMove.white, black: null}
    } else {
      this.moves.pop()
    }
  }

  ngOnDestroy(): void {
    this.positionChangeSubscription?.unsubscribe()
    this.gameStartedSubscription?.unsubscribe()
  }
}
