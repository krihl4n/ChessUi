import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cookieService: CookieService) { 
  }

  public save(gameId: String, playerId: String) {
      this.cookieService.set('chess-game', JSON.stringify({gameId, playerId}))
  }

  public getGame(): SavedGame | null {
    var cookieValue = this.cookieService.get('chess-game')
    if(cookieValue) {
      return JSON.parse(cookieValue)
    }
    return null
  }
}

export interface SavedGame{
  gameId: string,
  playerId: string 
}
