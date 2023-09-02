import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cookieService: CookieService) { 
  }

  public save(gameId: string, playerId: string) {
      this.cookieService.delete('chess-game')
      this.cookieService.set('chess-game', JSON.stringify({gameId, playerId}), undefined, "/game")
  }

  public getGame(): SavedGame | undefined {
    var cookieValue = this.cookieService.get('chess-game')
    if(cookieValue) {
      return JSON.parse(cookieValue)
    }
    return undefined
  }

  public getPlayerId(): string | undefined {
    var cookieValue = this.cookieService.get('chess-game')
    if(cookieValue) {
      return JSON.parse(cookieValue).playerId
    }
    return undefined
  }
}

export interface SavedGame {
  gameId: string,
  playerId: string 
}
