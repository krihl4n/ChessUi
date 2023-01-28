import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  resign() {
    this.gameService.resign()
  }

}
