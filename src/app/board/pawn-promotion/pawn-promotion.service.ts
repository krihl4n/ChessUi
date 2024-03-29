import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { COLOR_WHITE, PAWN } from 'src/app/model/typings';
import { PiecesLocations } from '../tools/pieces-locations';
import { Promotion } from './promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PawnPromotionService {

  private shouldDisplay = false
  private promotionSelected?: string
  private promotionOpened: Subject<null> = new Subject()
  private promotionClosed: Subject<Promotion | undefined> = new Subject()

  private from: string = ""
  private to: string = ""

  constructor(private piecesLocations: PiecesLocations) { }

  shouldOpenPromotionChoice(from: string, to: string, playerColor: string) {
    return this.isLastRank(to, playerColor) && !this.hasPlayerSelectedPromotion() && this.piecesLocations.get(from)?.type == PAWN 
  }

  shouldDisplayPromotionChoice() {
    return this.shouldDisplay
  }

  display(from: string, to: string) {
    this.from = from
    this.to = to
    this.promotionOpened.next()
    this.shouldDisplay = true
  }

  closeSelection(promotionSelected?: string) {
    if (!this.shouldDisplay) {
      return
    }
    this.shouldDisplay = false
    this.promotionSelected = promotionSelected

    let promotion

    if(promotionSelected) {
      promotion = { promotion: promotionSelected, from: this.from, to: this.to } 
    }

    this.promotionClosed.next(promotion)
  }

  getDestingationField() {
    return this.to
  }

  private hasPlayerSelectedPromotion() {
    return this.promotionSelected
  }

  moveWithPromotionPerformed() {
    this.promotionSelected = undefined
  }

  private isLastRank(to: string, playerColor: string) {
    if (playerColor == COLOR_WHITE) {
      return to[1] == '8'
    } else {
      return to[1] == '1'
    }
  }

  getPromotionOpenedObservable() {
    return this.promotionOpened.asObservable()
  }

  getPromotionClosedObservable() {
    return this.promotionClosed.asObservable()
  }
}
