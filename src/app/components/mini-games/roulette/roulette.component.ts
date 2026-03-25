import { Component, OnInit, OnDestroy } from '@angular/core';
import { CombinacionesService } from '../../../core/services/combinaciones.service';
import { environment } from '../../../../environments/environment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.css'],
})
export class RouletteComponent implements OnInit, OnDestroy {
  segments: string[] = [];
  currentSegmentIndex = 0;
  currentSegmentDisplay = '-';
  showResult = false;
  resultName = '';
  resultDesc = '';
  modalSeconds = 30;
  countdownRemaining = 30;
  hasSpun = false;
  manualStart = true;
  combos: any = {};
  texts: any = {};
  currentLang: 'es' | 'en' = environment.idiomaPorDefecto;
  currentPhase: 'setup' | 'playing' = 'setup';
  showInstructions = false;

  private spinInterval: any = null;
  private countdownInterval: any = null;
  private langSub?: Subscription;

  constructor(
    private combinacionesService: CombinacionesService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // Obtiene idioma actual (por si viene de localStorage o app principal)
    this.currentLang = (this.translate.currentLang as 'es' | 'en') || environment.idiomaPorDefecto;

    this.loadTexts();
    this.loadRuletaData();

    // 🔹 Escucha cambios globales de idioma (banderas)
    this.langSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang as 'es' | 'en';
      this.loadTexts();
      this.loadRuletaData();
    });
  }

  ngOnDestroy() {
    clearInterval(this.spinInterval);
    clearInterval(this.countdownInterval);
    this.langSub?.unsubscribe();
  }

  /** 🔤 Carga textos estáticos desde i18n */
  private loadTexts() {
    this.translate.get('ROULETTE').subscribe({
      next: (res) => {
        this.texts = {
          title: res.TITLE || 'Hot Roulette',
          description: res.DESCRIPTION || '',
          timeLabel: res.TIME || 'Time (sec):',
          spin: res.SPIN || 'Spin',
          spinAgain: res.RETRY || 'Spin again',
          start: res.START || 'Start',
          reset: res.RESET || 'Reset',
          result: res.RESULT_LABEL?.replace('{{segment}}', '')?.trim() || 'Result',
          timeUp: res.TIME_UP || 'Time’s up!',
        };
      },
      error: (err) => console.error('❌ Error al cargar textos:', err),
    });
  }

  /** 🎰 Carga combinaciones de la ruleta según el idioma */
  private loadRuletaData() {
    this.combinacionesService.getCombinacionesRuleta(this.currentLang).subscribe({
      next: (data) => {
        this.combos = data.ruleta || {};
        this.segments = Object.keys(this.combos);
        console.log(`✅ Ruleta cargada (${this.currentLang}):`, this.segments);
      },
      error: (err) => console.error('❌ Error al cargar ruleta:', err),
    });
  }

  /** 🎯 Inicia el giro de la ruleta */
  startSpin() {
    if (!this.segments.length) return;

    clearInterval(this.spinInterval);
    clearInterval(this.countdownInterval);

    this.showResult = false;
    this.manualStart = true;
    this.hasSpun = true;

    this.spinInterval = setInterval(() => {
      this.currentSegmentIndex = Math.floor(Math.random() * this.segments.length);
      this.currentSegmentDisplay = this.segments[this.currentSegmentIndex];
    }, 80);

    const duration = 1200 + Math.random() * 1000;
    setTimeout(() => {
      clearInterval(this.spinInterval);
      const finalIndex = Math.floor(Math.random() * this.segments.length);
      this.currentSegmentIndex = finalIndex;
      this.currentSegmentDisplay = this.segments[finalIndex];
      this.finalizeResult(finalIndex);
    }, duration);
  }

  /** 🏁 Muestra el resultado final */
  finalizeResult(index: number) {
    this.showResult = true;
    const segment = this.segments[index];
    this.resultName = `${this.texts.result || 'Result'} ${segment}`;

    const opciones = this.combos?.[segment] || [];
    if (opciones.length > 0) {
      const randomIndex = Math.floor(Math.random() * opciones.length);
      this.resultDesc = opciones[randomIndex];
    } else {
      this.resultDesc =
        this.currentLang === 'es'
          ? `Sin descripción para "${segment}".`
          : `No description for "${segment}".`;
    }

    this.countdownRemaining = this.modalSeconds;
  }

  /** ⏱️ Inicia el temporizador */
  startCountdown(seconds: number) {
    if (!this.showResult) return;

    clearInterval(this.countdownInterval);
    this.manualStart = false;
    this.countdownRemaining = Math.max(1, Math.floor(this.modalSeconds));

    this.countdownInterval = setInterval(() => {
      this.countdownRemaining--;
      if (this.countdownRemaining <= 0) {
        clearInterval(this.countdownInterval);
        alert(this.texts.timeUp || 'Time’s up!');
      }
    }, 1000);
  }

  /** 🔄 Reinicia todo */
  reset() {
    clearInterval(this.spinInterval);
    clearInterval(this.countdownInterval);
    this.currentSegmentDisplay = '-';
    this.showResult = false;
    this.countdownRemaining = this.modalSeconds;
    this.hasSpun = false;
    this.manualStart = true;
  }

  /** ⏰ Formatea el tiempo en formato mm:ss */
  formatTimer(sec: number) {
    const s = Math.max(0, Math.floor(sec || 0));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  startGamePhase() {
    this.currentPhase = 'playing';
  }

  backToSetup() {
    this.reset();
    this.currentPhase = 'setup';
  }
}
