import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GameModalService } from './core/services/game-modal.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = '';
  titleText = '';
  currentSection = 'home';
  modalOpen = false;
  selectedGame: string | null = null;
  private sub?: Subscription;
  currentLang = 'es';

  constructor(
    private gameModalService: GameModalService,
    private translate: TranslateService,
    private titleService: Title,
    private meta: Meta,
    private cdr: ChangeDetectorRef
  ) {
    // Idiomas disponibles
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');

    // Verifica idioma guardado o usa el del navegador
    const savedLang = localStorage.getItem('appLang');
    const browserLang = this.translate.getBrowserLang();
    const initialLang = savedLang || (browserLang?.match(/en|es/) ? browserLang : 'es');

    this.currentLang = initialLang;
    this.translate.use(initialLang);
  }

  ngOnInit() {
    console.log('AppComponent iniciado');

    // 🔹 Aplaza la carga de textos para evitar ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.updateTexts();
      this.updateMetaTags();
      this.cdr.detectChanges();
    });

    // Suscripción a eventos de abrir juego
    this.sub = this.gameModalService.openGame$.subscribe((gameId) => {
      console.log('📦 AppComponent recibió openGame:', gameId);
      this.openGame(gameId);
    });

    // Escucha cambios de idioma
    this.translate.onLangChange.subscribe(() => {
      // 🔹 Evita el error al actualizar después del render inicial
      setTimeout(() => {
        this.updateTexts();
        this.updateMetaTags();
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }



  openGame(gameId: string) {
    this.selectedGame = gameId;
    this.modalOpen = true;
    history.pushState({}, '', '#' + gameId);
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedGame = null;
    history.pushState({}, '', '#/');
    this.resetTitle();
  }

  private resetTitle() {
    this.translate.get('HOME.TITLE_TEXT').subscribe(text => (this.titleText = text));
  }

  changeLang(lang: string) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    localStorage.setItem('appLang', lang);
    this.translate.use(lang);
  }

  private updateTexts() {
    this.translate.get('HOME.TITLE').subscribe(text => (this.title = text));
    this.translate.get('HOME.TITLE_TEXT').subscribe(text => (this.titleText = text));
  }

  private updateMetaTags() {
    this.translate.get('META.TITLE').subscribe(text => this.titleService.setTitle(text));
    this.translate.get('META.DESCRIPTION').subscribe(desc => {
      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ name: 'twitter:description', content: desc });
    });
  }
}
