import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameStartEvent, PiecePositionUpdate } from 'src/app/model/messages';
import { GameResult } from 'src/app/model/typings';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-recorded-moves',
  templateUrl: './recorded-moves.component.html',
  styleUrls: ['./recorded-moves.component.css']
})
export class RecordedMovesComponent implements OnInit, OnDestroy {

  moves: { white: string, black: string | null }[] = []
  result = ""
  private positionChangeSubscription: Subscription
  private gameStartedSubscription: Subscription
  private gameFinishedSubscription: Subscription

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.positionChangeSubscription = this.gameService.getPiecePositionChangeObservable()
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
      .subscribe((gameResult: GameResult) => {
        if (gameResult.result == "white_player_won") {
          this.result = "1-0"
        } else if (gameResult.result == "black_player_won") {
          this.result = "0-1"
        } else if (gameResult.result == "draw") {
          this.result = "1/2-1/2"
        }
      })
  }

  push(label: string) {
    let lastMove = this.moves[this.moves.length - 1]
    if (lastMove && !lastMove.black) {
      this.moves[this.moves.length - 1] = { white: lastMove.white, black: label }
    } else {
      this.moves.push({ white: label, black: null })
    }
  }

  pop() {
    let lastMove = this.moves[this.moves.length - 1]
    if (lastMove && lastMove.black) {
      this.moves[this.moves.length - 1] = { white: lastMove.white, black: null }
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
