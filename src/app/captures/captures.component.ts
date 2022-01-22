import { Component } from '@angular/core';
import { GameTrackerService } from '../services/game-tracker.service';

@Component({
  selector: 'app-captures',
  templateUrl: './captures.component.html',
  styleUrls: ['./captures.component.css']
})
export class CapturesComponent{

  constructor(private gameTracker: GameTrackerService) { }

  getCaptures() {
    return this.gameTracker.captures
  }
}
