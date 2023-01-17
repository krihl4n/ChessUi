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

    return null
  }
}

export interface SavedGame{
  gameId: String,
  playerId: String 
}
