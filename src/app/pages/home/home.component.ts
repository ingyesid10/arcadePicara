import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameModalService } from 'src/app/core/services/game-modal.service';
import { TranslateService } from '@ngx-translate/core';
import { DataLayerService } from 'src/app/core/services/data-layer.service';


interface GameItem {
  name: string;
  icon: string;
  width: string;
  id: string;
  categories: string[];
  translatedName?: string;
  class?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePage implements OnInit, OnDestroy {

  showSelector = true;
  showGames = false;
  introText = '';
  messageNext = '';
  filteredGames: any[] = [];
  private routerSub?: Subscription;

  allGames: GameItem[] = [
    { name: 'GAMES.DICE_KAMASUTRA', icon: 'kamasutra.svg', class: 'kamasutra', width: '121', id: 'juego-de-dados', categories: ['pareja'] },
    { name: 'GAMES.DICE_ORAL', icon: 'oral.svg', width: '65', id: 'juego-dados-placer-oral', categories: ['pareja'] },
    { name: 'GAMES.KISS_ROULETTE', icon: 'besos.svg', width: '65', id: 'juego-de-besos', categories: ['fiesta', 'pareja'] },
    { name: 'GAMES.HIGHER_LOWER_SHOT', icon: 'cartas.svg', width: '65', id: 'juego-de-tragos', categories: ['fiesta', 'pareja'] },
    { name: 'GAMES.TRUTH_OR_DARE_SIMPLE', icon: 'verdadReto.svg', width: '53', id: 'juego-de-verdad', categories: ['fiesta', 'pareja'] },
    { name: 'GAMES.CHALLENGE_ROULETTE', icon: 'retos.svg', width: '65', id: 'ruleta-de-retos', categories: ['fiesta', 'pareja'] },
    { name: 'GAMES.TRUTH_OR_DARE_PENALTY', icon: 'prenda.svg', width: '60', id: 'juego-de-retos', categories: ['fiesta', 'pareja'] },
    { name: 'GAMES.SPIN_BEER', icon: 'shot.svg', width: '90', id: 'ruleta-de-tragos', categories: ['fiesta'] },
    { name: 'GAMES.ROULETTE_HOT_PARTY', icon: 'ruleta.svg', width: '85', id: 'ruleta-hot-party', categories: ['fiesta', 'pareja'] },
    { name: 'GAMES.COUPLE_CHALLENGE', icon: '❤️', width: '65', id: 'desafio-de-parejas', categories: ['na'] },
    { name: 'GAMES.FANTASY_CARDS', icon: 'fantasias.svg', width: '65', id: 'fantasy-cards', categories: ['pareja'] }
  ];

  constructor(
    private gameModalService: GameModalService,
    private router: Router,
    private translate: TranslateService,
    private dataLayer: DataLayerService
  ) {}

  ngOnInit(): void {
    this.resetHome();

    this.translate.onLangChange.subscribe(() => {
      this.translateGameNames();
      this.updateTexts();
    });

    this.routerSub = this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/home' || event.url === '/home') {
          this.dataLayer.pushReturnHome(); // 📊 Evento volver al home
          this.resetHome();
        }
      });
            // this.exoClickService.loadPopunder();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private updateTexts(): void {
    if (this.showSelector) {
      this.translate.get('HOME.INTRO').subscribe(text => {
        this.introText = text;
      });
    } else {
      this.setRandomMessage();
    }
  }

  resetHome(): void {
    this.showSelector = true;
    this.showGames = false;
    this.filteredGames = [];
    this.translateGameNames();
    this.setRandomMessage();

    this.translate.get('HOME.INTRO').subscribe(text => {
      this.introText = text;
    });
  }

  private translateGameNames(): void {
    this.allGames.forEach(game => {
      game.translatedName = this.translate.instant(game.name);
    });
  }

  private setRandomMessage(): void {
    this.translate.get('HOME.RANDOM_MESSAGES').subscribe((messages: string[]) => {
      const index = Math.floor(Math.random() * messages.length);
      this.messageNext = messages[index];
    });
  }

selectCategory(category: string): void {
  this.dataLayer.pushGameClose(); // 🕒 cierra cualquier juego previo
  this.showSelector = false;
  this.showGames = true;
  //   setTimeout(() => {
  //   this.exoClickService.loadPopunder();
  // }, 1000); // Espera 1 segundo para que el DOM tenga las .game-card
  this.filteredGames = this.allGames.filter(game => game.categories.includes(category));

  this.dataLayer.pushCategorySelect(category);
}

open(gameId: string): void {
  const selectedGame = this.allGames.find(g => g.id === gameId);

  if (selectedGame) {
    this.dataLayer.pushGameOpen({
      id: selectedGame.id,
      name: selectedGame.translatedName || selectedGame.name,
      categories: selectedGame.categories
    });
  }

  this.gameModalService.open(gameId);
}


goBack(): void {
  this.dataLayer.pushGameClose(); // 🕒 cierra si hay un juego activo
  this.dataLayer.pushReturnHome();
  this.resetHome();
}
}
