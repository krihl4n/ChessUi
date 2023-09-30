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
  width: string
  
  ngOnInit(): void {
    this.path = "assets/" + this.color + "_" + this.type + ".png"
    this.getWidth()
  }

  getWidth() {
    if (this.type == "queen") {
      this.width = "25"
    } else if (this.type == "pawn") {
      this.width = "18"
    } else if (this.type == "knight") {
      this.width = "22"
    } else {
      this.width = "20"
    }
  }
}
