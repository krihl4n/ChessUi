import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PawnPromotionService } from 'src/app/board/pawn-promotion/pawn-promotion.service';
import { FieldUtilsService } from '../tools/field-utils.service';

@Component({
  selector: 'app-pawn-promotion',
  templateUrl: './pawn-promotion.component.html',
  styleUrls: ['./pawn-promotion.component.css']
})
export class PawnPromotionComponent implements OnInit, OnDestroy {

  constructor(private fieldUtils: FieldUtilsService, private pawnPromotionService: PawnPromotionService){}

  @Input()
  height: number

  @Input()
  width: number

  private openSubscription: Subscription
  private closeSubscription: Subscription

  ngOnInit(): void {
    this.openSubscription = this.pawnPromotionService.getPromotionOpenedObservable().subscribe(() => {
      window.addEventListener('mouseup', this.listener)
    })

    this.closeSubscription = this.pawnPromotionService.getPromotionClosedObservable().subscribe(() => {
      window.removeEventListener('mouseup', this.listener)
    })
  }

  ngOnDestroy(): void {
    this.closeSubscription?.unsubscribe()
    this.openSubscription?.unsubscribe()
    window.removeEventListener('mouseup', this.listener)
  }

  listener = () => {
    this.pawnPromotionService.closeSelection(null)
  }

  promotionSelected(event: Event, promotion: string) {
    console.log("************ PROMOTION SELECTED")
    console.log(promotion)
    this.pawnPromotionService.closeSelection(promotion)
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
