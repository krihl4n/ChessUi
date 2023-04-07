import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PiecesLocations } from './board/tools/pieces-locations';

@Injectable({
  providedIn: 'root'
})
export class PawnPromotionService {

// move to different location
// undo move scenarios
// change pawn to promoted piece icon

  private shouldDisplay = false
  private promotionSelected : string | null
  promotionOpened: Subject<string | null> = new Subject()
  promotionClosed: Subject<{promotion: string, from: string, to: string} | null> = new Subject()

  private from: string = ""
  private to: string = ""

  constructor(private piecesLocations: PiecesLocations) { }

  shouldOpenPromotionChoice(from: string, to: string, playerColor: string) {
    return this.isLastRank(to, playerColor) && !this.hasPlayerSelectedPromotion() && this.piecesLocations.get(from)?.type == "pawn"
  }

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

  moveWithPromotionPerformed() {
    this.promotionSelected = null
  }

  private isLastRank(to: string, playerColor: string) {
    if(playerColor == 'WHITE') {
      return to[1] == '8'
    } else {
      return to[1] == '1'
    }
  }
}
