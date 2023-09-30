import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  undoVisible = true
  resignVisible = true
  rematchVisible = false

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getGameFinishedObservable().subscribe(result => {
      this.rematchVisible = true
      this.undoVisible = false
      this.resignVisible = false
    })
  }

  resign() {
    this.gameService.resign()
  }

  undoMove() {
    this.gameService.undoMove()
  }

  rematch() {
    this.gameService.rematch()    
  }
}
