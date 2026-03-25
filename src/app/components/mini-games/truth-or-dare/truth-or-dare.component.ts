import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-truth-or-dare',
  templateUrl: './truth-or-dare.component.html',
  styleUrls: ['./truth-or-dare.component.css'],
})
export class TruthOrDareComponent implements OnInit, OnDestroy {
  segments: string[] = [];
  currentSegmentDisplay = '-';
  showResult = false;
  resultName = '';
  resultSub = '';
  hasSpun = false;
  spinning = false;
  labels: any = {};
  currentPhase: 'setup' | 'playing' = 'setup';
  showInstructions = false;

  private spinInterval: any = null;
  private langSub?: Subscription;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    // 🔹 Cargar traducciones al iniciar
    this.loadTranslations();

    // 🔹 Escuchar cambios globales de idioma
    this.langSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadTranslations();
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  /** Carga los textos traducidos desde i18n */
  private loadTranslations() {
    this.translate.get('TRUTH_OR_DARE').subscribe((res) => {
      this.labels = res;

      // Asegura que los textos cortos también cambian correctamente
      this.segments = [res.TRUTH_LABEL_SHORT, res.DARE_LABEL_SHORT];

      // Si la ruleta ya está mostrando algo, lo actualiza también
      if (this.currentSegmentDisplay !== '-' && !this.hasSpun) {
        const idx = Math.random() > 0.5 ? 0 : 1;
        this.currentSegmentDisplay = this.segments[idx];
      }
    });
  }

  startSpin() {
    if (this.spinInterval) clearInterval(this.spinInterval);

    this.showResult = false;
    this.hasSpun = true;
    this.spinning = true;

    this.spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.segments.length);
      this.currentSegmentDisplay = this.segments[randomIndex];
    }, 80);

    const duration = 1200 + Math.random() * 1000;
    setTimeout(() => {
      if (this.spinInterval) {
        clearInterval(this.spinInterval);
        this.spinInterval = null;
      }
      this.spinning = false;
      const finalIndex = Math.floor(Math.random() * this.segments.length);
      this.currentSegmentDisplay = this.segments[finalIndex];
      this.finalizeResult(finalIndex);
    }, duration);
  }

  finalizeResult(index: number) {
    const segment = this.segments[index];

    if (segment === this.labels.DARE_LABEL_SHORT) {
      this.resultName = this.labels.DARE_LABEL;
      this.resultSub = this.labels.DARE_DESCRIPTION;
    } else {
      this.resultName = this.labels.TRUTH_LABEL;
      this.resultSub = this.labels.TRUTH_DESCRIPTION;
    }

    this.showResult = true;
  }

  reset() {
    if (this.spinInterval) clearInterval(this.spinInterval);
    this.currentSegmentDisplay = '-';
    this.showResult = false;
    this.hasSpun = false;
    this.spinning = false;
  }

  startGame() {
    this.currentPhase = 'playing';
    this.reset();
  }

  backToSetup() {
    this.reset();
    this.currentPhase = 'setup';
  }
}
