import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private gameSource = new BehaviorSubject<any>(null);
  game$ = this.gameSource.asObservable();

  open(game: any) {
    console.log('Hola')
    this.gameSource.next(game);
  }

  close() {
    this.gameSource.next(null);
  }
}
