import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-spin-beer',
  templateUrl: './spin-beer.component.html',
  styleUrls: ['./spin-beer.component.css']
})
export class SpinBeerComponent implements OnInit, OnDestroy {
  leftDieValue: number = 1;
  rightDieValue: number = 1;
  showResult = false;
  spinning = false;
  showRulesModal = false;
  labels: any = {};
  rulesList: any[] = [];
  gameRules: any = {};
  currentPhase: 'setup' | 'playing' = 'setup';
  showInstructions = false;

  private langSub?: Subscription;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.loadTranslations();

    // 🔹 Escuchar cambios de idioma
    this.langSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadTranslations();
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  /** 🔸 Carga los textos traducidos desde i18n */
  private loadTranslations() {
    this.translate.get('SPIN_BEER').subscribe((res) => {
      this.labels = res;

      // Reglas traducidas
      this.gameRules = res.RULES;
      this.rulesList = res.RULES_LIST;
    });
  }

  startSpin() {
    if (this.spinning) return;

    this.showResult = false;
    this.spinning = true;

    const spinDuration = 1200 + Math.random() * 600;
    const spinInterval = setInterval(() => {
      this.leftDieValue = this.getRandomDieValue();
      this.rightDieValue = this.getRandomDieValue();
    }, 80);

    setTimeout(() => {
      clearInterval(spinInterval);
      this.leftDieValue = this.getRandomDieValue();
      this.rightDieValue = this.getRandomDieValue();
      this.spinning = false;
      this.finalizeResult();
    }, spinDuration);
  }

  getRandomDieValue(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  finalizeResult() {
    this.showResult = true;
  }

  get resultName(): string {
    const total = this.leftDieValue + this.rightDieValue;

    if (this.leftDieValue === 1 && this.rightDieValue === 1) {
      return this.gameRules.DOUBLE1.name;
    } else if (this.leftDieValue === 6 && this.rightDieValue === 6) {
      return this.gameRules.DOUBLE6.name;
    } else if (total === 7) {
      return this.gameRules['7'].name;
    } else if (total === 8) {
      return this.gameRules['8'].name;
    } else if (total === 9) {
      return this.gameRules['9'].name;
    } else if (this.leftDieValue === this.rightDieValue) {
      return this.gameRules.PAIR.name;
    } else {
      return this.gameRules.DEFAULT.name;
    }
  }

  get resultDesc(): string {
    const total = this.leftDieValue + this.rightDieValue;

    if (this.leftDieValue === 1 && this.rightDieValue === 1) {
      return this.gameRules.DOUBLE1.desc;
    } else if (this.leftDieValue === 6 && this.rightDieValue === 6) {
      return this.gameRules.DOUBLE6.desc;
    } else if (total === 7) {
      return this.gameRules['7'].desc;
    } else if (total === 8) {
      return this.gameRules['8'].desc;
    } else if (total === 9) {
      return this.gameRules['9'].desc;
    } else if (this.leftDieValue === this.rightDieValue) {
      return this.gameRules.PAIR.desc;
    } else {
      return this.gameRules.DEFAULT.desc;
    }
  }

  get leftDieImage(): string {
    return `${environment.dadosImg}${this.formatDieValue(this.leftDieValue)}.svg`;
  }

  get rightDieImage(): string {
    return `${environment.dadosImg}${this.formatDieValue(this.rightDieValue)}.svg`;
  }

  formatDieValue(value: number): string {
    return value.toString().padStart(2, '0');
  }

  openRulesModal() {
    this.showRulesModal = true;
  }

  closeRulesModal() {
    this.showRulesModal = false;
  }

  startGame() {
    this.currentPhase = 'playing';
  }

  backToSetup() {
    this.currentPhase = 'setup';
    this.showResult = false;
    this.spinning = false;
  }
}
