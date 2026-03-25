import { Component, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roulette-hot-party',
  templateUrl: './roulette-hot-party.component.html',
  styleUrls: ['./roulette-hot-party.component.css']
})
export class RouletteHotPartyComponent implements OnDestroy {
  allOptions: any[] = [];
  activeSegments: any[] = [];
  currentSegmentDisplay = '-';
  showResult = false;
  resultName = '';
  resultDesc = '';
  hasSpun = false;
  currentPhase: 'setup' | 'playing' = 'setup';
  showInstructions = false;

  private spinInterval: any = null;
  private langSub?: Subscription;

  constructor(private translate: TranslateService) {
    this.initOptions();
    this.langSub = this.translate.onLangChange.subscribe(() => this.initOptions());
  }

  ngOnDestroy() {
    clearInterval(this.spinInterval);
    this.langSub?.unsubscribe();
  }

  /** Inicializa opciones bilingües */
  initOptions() {
    const keys = ['CLOTH', 'SHOT', 'SKIP', 'TRUTH', 'ALL_DRINK', 'ALL_CLOTH'];
    this.allOptions = keys.map(k => ({
      key: k,
      label: this.translate.instant(`ROULETTE_HOT_PARTY.OPTIONS.${k}`),
      message: this.translate.instant(`ROULETTE_HOT_PARTY.RESULTS.${k}`),
      enabled: true,
      weight: (k === 'ALL_DRINK' || k === 'ALL_CLOTH') ? 0.5 : 1
    }));
    this.updateActiveSegments();
  }

  /** Actualiza los segmentos activos */
  updateActiveSegments() {
    this.activeSegments = this.allOptions.filter(opt => opt.enabled);
  }

  /** Inicia el giro tipo spinFake */
  startSpin() {
    if (this.activeSegments.length === 0) return;

    clearInterval(this.spinInterval);
    this.showResult = false;
    this.hasSpun = true;

    let ticks = 0;
    this.spinInterval = setInterval(() => {
      const index = Math.floor(Math.random() * this.activeSegments.length);
      this.currentSegmentDisplay = this.activeSegments[index].label;
      ticks++;
    }, 90);

    const duration = 1200 + Math.random() * 800;
    setTimeout(() => {
      clearInterval(this.spinInterval);
      const weighted = this.activeSegments.flatMap(opt => Array(Math.floor(opt.weight * 10)).fill(opt));
      const selected = weighted[Math.floor(Math.random() * weighted.length)];

      this.currentSegmentDisplay = selected.label;
      this.resultName = selected.label;
      this.resultDesc = selected.message;
      this.showResult = true;
    }, duration);
  }

  reset() {
    clearInterval(this.spinInterval);
    this.currentSegmentDisplay = '-';
    this.showResult = false;
    this.resultName = '';
    this.resultDesc = '';
    this.hasSpun = false;
  }

  startGamePhase() {
    this.currentPhase = 'playing';
  }

  backToSetup() {
    this.reset();
    this.currentPhase = 'setup';
  }
}
