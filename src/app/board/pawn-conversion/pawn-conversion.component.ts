import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pawn-conversion',
  templateUrl: './pawn-conversion.component.html',
  styleUrls: ['./pawn-conversion.component.css']
})
export class PawnConversionComponent implements OnInit {

  @Input()
  height: number

  @Input()
  width: number

  constructor() { }

  ngOnInit(): void {
  }

}
