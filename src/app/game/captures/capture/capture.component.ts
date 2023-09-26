import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit {

  @Input() color: string
  @Input() type: string

  path: string
  constructor() { }

  ngOnInit(): void {
    this.path = "assets/" + this.color + "_" + this.type + ".png"
  }
}
