import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PawnPromotionService } from 'src/app/pawn-promotion.service';
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
      console.log("promotion opened")
      window.addEventListener('mousedown', this.listener)
    })

    this.closeSubscription = this.pawnPromotionService.getPromotionClosedObservable().subscribe(() => {
      console.log("promotion closed")
      window.removeEventListener('mousedown', this.listener)
    })


    window.addEventListener('mousedown', (e: MouseEvent) => { // subscribe only when visible, unsubscribe when closed
      //this.pawnPromotionService.closeSelection()
    }) 
  }

  ngOnDestroy(): void {
    this.closeSubscription?.unsubscribe()
    this.openSubscription?.unsubscribe()
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
