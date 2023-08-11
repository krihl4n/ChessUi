import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recorded-moves',
  templateUrl: './recorded-moves.component.html',
  styleUrls: ['./recorded-moves.component.css']
})
export class RecordedMovesComponent implements OnInit {

  moves: string[] = ["Qa1", "Bxc4", "O-O", ]
  constructor() { }

  ngOnInit(): void {
  }

}
