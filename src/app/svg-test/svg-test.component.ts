import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-test',
  templateUrl: './svg-test.component.html',
  styleUrls: ['./svg-test.component.css']
})
export class SvgTestComponent implements OnInit {

  constructor() { }
  leftPos="0px"

  ngOnInit(): void {
  }

  onImageClick() {
    if(this.leftPos === "0px") {
      this.leftPos = "1000px"; 
    } else {
      this.leftPos = "0px"
    }
  }
}
