import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GameControlService } from '../services/game-control.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  constructor(private gameControlService: GameControlService) { }

  ngOnInit(): void {
    this.gameControlService.connect()
  }

  onConnect() {
    this.gameControlService.connect()
  }

  onDisconnect() {
    this.gameControlService.disconnect();
  }

  onGameStart(mode: String) {
    this.gameControlService.startGame(mode)
  }

  onGameFinish() {

  }

  onUndo() {
    this.gameControlService.undoMove()
  }

  onRedo() {
    this.gameControlService.redoMove()
  }

  onResign() {
    this.gameControlService.resign()
  }
}
