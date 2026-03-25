import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameModalService {
  private openGameSource = new Subject<string>();
  openGame$ = this.openGameSource.asObservable();

  open(gameId: string) {
    console.log('🎯 Servicio emite openGame:', gameId);
    this.openGameSource.next(gameId);
  }
}
