import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PawnPromotionService {

  private shouldDisplay = false

  constructor() { }

  shouldDisplayPromotionChoice() {
    return this.shouldDisplay
  }

  display() {
    this.shouldDisplay = true
  }
}
