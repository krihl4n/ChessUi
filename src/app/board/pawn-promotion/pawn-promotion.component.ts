import { Component, Input, OnInit } from '@angular/core';
import { PawnPromotionService } from 'src/app/pawn-promotion.service';
import { FieldUtilsService } from '../tools/field-utils.service';

@Component({
  selector: 'app-pawn-promotion',
  templateUrl: './pawn-promotion.component.html',
  styleUrls: ['./pawn-promotion.component.css']
})
export class PawnPromotionComponent implements OnInit {

  constructor(private fieldUtils: FieldUtilsService, private pawnPromotionService: PawnPromotionService){}

  @Input()
  height: number

  @Input()
  width: number


  ngOnInit(): void {

    this.pawnPromotionService.promotionOpened.subscribe(() => {
      console.log("promotion opened")
      window.addEventListener('mousedown', this.listener)
    })

    this.pawnPromotionService.promotionClosed.subscribe(() => {
      console.log("promotion closed")
      window.removeEventListener('mousedown', this.listener)
    })


    window.addEventListener('mousedown', (e: MouseEvent) => { // subscribe only when visible, unsubscribe when closed
      //this.pawnPromotionService.closeSelection()
    })

    
  }

  listener = () => {
    this.pawnPromotionService.closeSelection()
  }

  fieldSize() {
    return this.fieldUtils.fieldSize
  }

  getSelectorLocation() {
    return this.fieldSize() * 5
  }

  visible() {
    return this.pawnPromotionService.shouldDisplayPromotionChoice()
  }
}
