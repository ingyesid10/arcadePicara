import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ModalComponent } from './components/modal/modal.component';
import { FooterComponent } from './components/footer/footer.component';

//miniGames
import { DiceComponent } from './components/mini-games/dice/dice.component';
import { DiceOralComponent } from './components/mini-games/dice-oral/dice-oral.component';
import { RouletteComponent } from './components/mini-games/roulette/roulette.component';
import { DesprendeteComponent } from './components/mini-games/desprendete/desprendete.component';
import { SpinBeerComponent } from './components/mini-games/spin-beer/spin-beer.component';
import { TruthOrDareComponent } from './components/mini-games/truth-or-dare/truth-or-dare.component';
import { KissRouletteComponent } from './components/mini-games/kiss-roulette/kiss-roulette.component';
import { HigherLowerShotComponent } from './components/mini-games/higher-lower-shot/higher-lower-shot.component';
import { RouletteHotPartyComponent } from './components/mini-games/roulette-party/roulette-hot-party.component';
import { FantasyCardsComponent } from './components/mini-games/fantasy-cards/fantasy-cards.component';
import { WouldYouRatherComponent } from './components/mini-games/would-you-rather/would-you-rather.component';

//cookie
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { CommonModule } from '@angular/common';

// ✅ Configuración clásica y estable
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ModalComponent,
    FooterComponent,
    DiceComponent,
    RouletteComponent,
    DesprendeteComponent,
    CookieConsentComponent,
    SpinBeerComponent,
    TruthOrDareComponent,
    KissRouletteComponent,
    HigherLowerShotComponent,
    RouletteHotPartyComponent,
    DiceOralComponent,
    FantasyCardsComponent,
    WouldYouRatherComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'es'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
