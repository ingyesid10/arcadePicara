import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CombinacionesService } from '../../../core/services/combinaciones.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

const niveles = 8;

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.css']
})
export class DiceComponent implements OnInit, OnDestroy {
  leftDisplay: number | string = '-';
  rightDisplay: number | string = '-';
  showResult = false;
  resultImageSrc = '/assets/img/default.jpg';
  resultName = '';
  resultDesc = '';
  resultAdvantages: string[] = [];
  resultDisadvantages: string[] = [];
  resultFunFact: string = '';
  countdownRemaining = 60;
  countdownInterval: any = null;
  modalSeconds = 60;
  spinning = false;
  combos: any = {};
  selectedCombination: any = null;
  langSubscription!: Subscription;
  timerActive = false; // ✅ Para controlar si el cronómetro está corriendo
  audioBeep = new Audio('assets/audio/beep.mp3'); // ✅ Sonido para los últimos 5s

  constructor(
    private combinacionesService: CombinacionesService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadCombinations();

    // 🔄 Detectar cambio de idioma
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadCombinations();
      if (this.leftDisplay !== '-' && this.rightDisplay !== '-') {
        this.finalizeResult(Number(this.leftDisplay), Number(this.rightDisplay));
      }
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) this.langSubscription.unsubscribe();
    this.stopAndResetTimer();
  }

  /** Carga las combinaciones según idioma */
  loadCombinations() {
    const lang = this.translate.currentLang || 'es';
    this.combinacionesService.getCombinaciones(lang as 'es' | 'en').subscribe(data => {
      this.combos = data || {};
    });
  }

  /** Inicia el giro de los dados */
  startSpin() {
    if (this.spinning) return;
    this.showResult = false;
    this.spinning = true;

    const spinDuration = 1200 + Math.random() * 600;
    const spinInterval = setInterval(() => {
      this.leftDisplay = this.randDieValue();
      this.rightDisplay = this.randDieValue();
    }, 80);

    setTimeout(() => {
      clearInterval(spinInterval);
      const left = this.randDieValue();
      const right = this.randDieValue();
      this.leftDisplay = left;
      this.rightDisplay = right;
      this.spinning = false;
      this.finalizeResult(left, right);
    }, spinDuration);
  }

  randDieValue() {
    return Math.floor(Math.random() * niveles) + 1;
  }

  /** Muestra el resultado final */
  finalizeResult(left: number, right: number) {
    this.showResult = true;
    const key = `${left}-${right}`;
    const lang = this.translate.currentLang || 'es';
    this.selectedCombination = this.combos[key] || this.combos[`${right}-${left}`] || null;

    if (this.selectedCombination) {
      this.updateTexts(lang);
    } else {
      this.resultName = `Result ${left}-${right}`;
      this.resultDesc = `No description available.`;
      this.resultAdvantages = [];
      this.resultDisadvantages = [];
      this.resultFunFact = '';
      this.resultImageSrc = '/assets/img/default.jpg';
    }
  }

  /** Actualiza los textos y la imagen */
  updateTexts(lang?: string) {
    if (!this.selectedCombination) return;
    lang = lang || this.translate.currentLang || 'es';

    const c = this.selectedCombination;
    if (lang === 'es') {
      debugger
      this.resultName = c.nombre;
      this.resultDesc = c.descripcion;
      this.resultAdvantages = c.ventajas || [];
      this.resultDisadvantages = c.desventajas || [];
      this.resultFunFact = c.dato_curioso || '';
      this.resultImageSrc = c.imagen?.replace(/^\.?\/?assets\//, '/assets/') || '/assets/img/default.jpg';
    } else {
      this.resultName = c.name;
      this.resultDesc = c.description;
      this.resultAdvantages = c.advantages || [];
      this.resultDisadvantages = c.disadvantages || [];
      this.resultFunFact = c.fun_fact || '';
      this.resultImageSrc = c.image?.replace(/^\.?\/?assets\//, '/assets/') || '/assets/img/default.jpg';
    }
  }

  /** Inicia el cronómetro y destaca la imagen */
  startCountdown() {
    this.stopAndResetTimer(); // reinicia antes de iniciar
    this.timerActive = true;
    this.countdownRemaining = Math.max(1, Math.floor(this.modalSeconds));

    this.countdownInterval = setInterval(() => {
      this.countdownRemaining--;

      // 🎵 Reproduce beep los últimos 5 segundos
      if (this.countdownRemaining <= 5 && this.countdownRemaining > 0) {
        this.audioBeep.play().catch(() => {}); // evita error si autoplay bloqueado
      }

      // ⏹ Detiene cuando llega a 0 (sin alert)
      if (this.countdownRemaining <= 0) {
        this.stopAndResetTimer();
      }
    }, 1000);
  }

  /** Detiene y reinicia el cronómetro */
  stopAndResetTimer() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.timerActive = false;
    this.countdownRemaining = this.modalSeconds;
  }

  /** Reinicia si se cierra la modal (simulado con tecla ESC o cierre) */
  @HostListener('document:keydown.escape', ['$event'])
  onModalClose(event: KeyboardEvent) {
    this.stopAndResetTimer();
  }

  formatTimer(sec: number) {
    const s = Math.max(0, Math.floor(sec || 0));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }
}
