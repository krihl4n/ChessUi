import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PiecePositionUpdate } from 'src/app/model/messages';
import { GameFinishedEvent, GameResult, GameStartEvent } from 'src/app/model/typings';
import { GameEventsService } from 'src/app/services/game-events.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-recorded-moves',
  templateUrl: './recorded-moves.component.html',
  styleUrls: ['./recorded-moves.component.css']
})
export class RecordedMovesComponent implements OnInit, OnDestroy {

  moves: { white: string, black?: string }[] = []
  result = ""
  private positionChangeSubscription: Subscription
  private gameStartedSubscription: Subscription
  private gameFinishedSubscription: Subscription

  constructor(private gameService: GameService, private gameEventsService: GameEventsService) { }

  ngOnInit(): void {
    this.positionChangeSubscription = this.gameEventsService.getPiecePositionUpdatedObservable()
      .subscribe((update: PiecePositionUpdate) => {
        if (update.reverted) {
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

    this.gameFinishedSubscription = this.gameService.getGameFinishedObservable()
      .subscribe((gameFinishedEvent: GameFinishedEvent) => {
        let result = gameFinishedEvent.gameResult.result
        if (result == "white_player_won") {
          this.result = "1-0"
        } else if (result == "black_player_won") {
          this.result = "0-1"
        } else if (result == "draw") {
          this.result = "1/2-1/2"
        }
      })
  }

  push(label: string) {
    let lastMove = this.moves[this.moves.length - 1]
    if (lastMove && !lastMove.black) {
      this.moves[this.moves.length - 1] = { white: lastMove.white, black: label }
    } else {
      this.moves.push({ white: label })
    }
  }

  pop() {
    let lastMove = this.moves[this.moves.length - 1]
    if (lastMove && lastMove.black) {
      this.moves[this.moves.length - 1] = { white: lastMove.white }
    } else {
      this.moves.pop()
    }
  }

  ngOnDestroy(): void {
    this.positionChangeSubscription?.unsubscribe()
    this.gameStartedSubscription?.unsubscribe()
    this.gameFinishedSubscription?.unsubscribe()
  }
}
