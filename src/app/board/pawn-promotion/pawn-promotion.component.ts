import { Component, Input, OnInit } from '@angular/core';
import { PawnPromotionService } from 'src/app/pawn-promotion.service';
import { FieldUtilsService } from '../tools/field-utils.service';

@Component({
  selector: 'app-pawn-promotion',
  templateUrl: './pawn-promotion.component.html',
  styleUrls: ['./pawn-promotion.component.css']
})
export class PawnPromotionComponent implements OnInit {

  constructor(private fieldUtils: FieldUtilsService, private pawnSelection: PawnPromotionService){}

  @Input()
  height: number

  @Input()
  width: number

  ngOnInit(): void {

  }

  fieldSize() {
    return this.fieldUtils.fieldSize
  }

  getSelectorLocation() {
    return this.fieldSize() * 5
  }

  visible() {
    return this.pawnSelection.shouldDisplayPromotionChoice()
  }
}
