import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PawnPromotionService {

  private shouldDisplay = false
  private promotionSelected : string | null
  promotionOpened: Subject<string | null> = new Subject()
  promotionClosed: Subject<{promotion: string, from: string, to: string} | null> = new Subject()

  private from: string = ""
  private to: string = ""

  constructor() { }

  shouldDisplayPromotionChoice() {
    return this.shouldDisplay
  }

  display(from: string, to: string) {
    console.log("display")
    this.from = from
    this.to = to
    this.promotionOpened.next()
    this.shouldDisplay = true
  }

  closeSelection() {
    console.log("close")
    this.shouldDisplay = false
    this.promotionSelected = "queen" // todo must clean
    this.promotionClosed.next({promotion: this.promotionSelected, from: this.from, to:this.to})
  }

  hasPlayerSelectedPromotion() {
    console.log("promotion selected: " + this.promotionSelected)
    return this.promotionSelected
  }

  moveWithSelectionPerformed() {
    this.promotionSelected = null
  }
}
