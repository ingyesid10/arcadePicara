import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface Player {
  name: string;
  gender: 'male' | 'female';
}

interface BodyPart {
  name: { es: string; en: string };
  image: string;
  isIntimate: boolean;
}

@Component({
  selector: 'app-kiss-roulette',
  templateUrl: './kiss-roulette.component.html',
  styleUrls: ['./kiss-roulette.component.css']
})
export class KissRouletteComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  includeIntimateParts = false;
  extremeMode = false;
  kissDuration = 30;
  showInstructions = true;

  currentPhase: 'setup' | 'spinning' | 'result' | 'kissCountdown' = 'setup';

  currentBodyPart = '';
  targetPlayer = '';
  currentAction = '';
  currentActionKey = '';
  currentPlayerIndex = 0;
  currentPlayerName = '';

  spinningBody = false;
  spinningPlayer = false;
  spinningAction = false;

  countdownTime = 0;
  countdownInterval: any = null;
  countdownActive = false;

  labels: any = {};
  private langSub?: Subscription;
  resultMessage = '';

  constructor(private translate: TranslateService) { }

  // ===========================
  // 🔹 Datos base
  // ===========================
  bodyParts: BodyPart[] = [
    { name: { es: 'MANO', en: 'HAND' }, image: '🖐️', isIntimate: false },
    { name: { es: 'MEJILLA', en: 'CHEEK' }, image: '😊', isIntimate: false },
    { name: { es: 'FRENTE', en: 'FOREHEAD' }, image: '🤔', isIntimate: false },
    { name: { es: 'HOMBRO', en: 'SHOULDER' }, image: '💪', isIntimate: false },
    { name: { es: 'ESPALDA', en: 'BACK' }, image: '🔙', isIntimate: false },
    { name: { es: 'CUELLO', en: 'NECK' }, image: '👔', isIntimate: false },
    { name: { es: 'PIE', en: 'FOOT' }, image: '👣', isIntimate: false },
    { name: { es: 'OMBLIGO', en: 'NAVEL' }, image: '🌀', isIntimate: true },
    { name: { es: 'MUSLO', en: 'THIGH' }, image: '🦵', isIntimate: true },
    { name: { es: 'PECHO', en: 'CHEST' }, image: '❤️', isIntimate: true },
    { name: { es: 'GLÚTEOS', en: 'BUTTOCKS' }, image: '🍑', isIntimate: true },
    { name: { es: 'PARTE ÍNTIMA', en: 'INTIMATE PART' }, image: '⚡', isIntimate: true },
    { name: { es: 'VAGINA', en: 'PUSSY' }, image: '👅', isIntimate: true },
    { name: { es: 'PENE', en: 'PENIS' }, image: '🚀', isIntimate: true },
    { name: { es: 'SENOS', en: 'BOOBS' }, image: '💄', isIntimate: true },
    { name: { es: 'ZONA DE LA INGLE', en: 'GROIN AREA' }, image: '😈', isIntimate: true },


  ];

  actions: { es: string; en: string }[] = [
    { es: 'besar', en: 'kiss' },
    { es: 'morder', en: 'bite' },
    { es: 'acariciar', en: 'caress' },
    { es: 'lamer', en: 'lick' },
    { es: 'chupar', en: 'suck' },
    { es: 'masajear', en: 'massage' },
    { es: 'oler', en: 'smell' },
    { es: 'rozar', en: 'rub' },
    { es: 'soplar', en: 'blow' },
    { es: 'susurrar en', en: 'whisper on' },
    { es: 'introducir suavemente en', en: 'gently insert into' }
  ];

  // 🔹 Mapas dinámicos para textos
  actionWhereMap: Record<string, { es: string; en: string }> = {
    besar: { es: '¿Dónde besar?', en: 'Where to kiss?' },
    morder: { es: '¿Dónde morder?', en: 'Where to bite?' },
    acariciar: { es: '¿Dónde acariciar?', en: 'Where to caress?' },
    lamer: { es: '¿Dónde lamer?', en: 'Where to lick?' },
    chupar: { es: '¿Dónde chupar?', en: 'where to suck?' },
    masajear: { es: '¿Dónde masajear?', en: 'Where to massage?' },
    oler: { es: '¿Dónde oler?', en: 'Where to smell?' },
    rozar: { es: '¿Dónde rozar?', en: 'Where to rub?' },
    soplar: { es: '¿Dónde soplar?', en: 'Where to blow?' },
    'susurrar en': { es: '¿Dónde susurrar?', en: 'Where to whisper?' },
    'introducir suavemente en': { es: '¿Dónde introducir?', en: 'Where to insert?' }
  };

  actionWhoMap: Record<string, { es: string; en: string }> = {
    besar: { es: '¿A quién besar?', en: 'Who to kiss?' },
    morder: { es: '¿A quién morder?', en: 'Who to bite?' },
    acariciar: { es: '¿A quién acariciar?', en: 'Who to caress?' },
    lamer: { es: '¿A quién lamer?', en: 'Who to lick?' },
    chupar: { es: '¿A quién chupar?', en: 'Who to suck?' },
    masajear: { es: '¿A quién masajear?', en: 'Who to massage?' },
    oler: { es: '¿A quién oler?', en: 'Who to smell?' },
    rozar: { es: '¿A quién rozar?', en: 'Who to rub?' },
    soplar: { es: '¿A quién soplar?', en: 'Who to blow?' },
    'susurrar en': { es: '¿A quién susurrar?', en: 'Who to whisper?' },
    'introducir suavemente en': { es: '¿A quién introducir?', en: 'Who to insert?' }
  };

  ngOnInit(): void {
    this.loadTranslations();
    this.langSub = this.translate.onLangChange.subscribe(() => this.loadTranslations());
  }

  ngOnDestroy(): void {
    this.clearCountdown();
    this.langSub?.unsubscribe();
  }

  private loadTranslations(): void {
    this.translate.get('KISS_ROULETTE').subscribe(res => (this.labels = res || {}));
  }

  private currentLang(): 'es' | 'en' {
    return (this.translate.currentLang as 'es' | 'en') || 'es';
  }

  // ===========================
  // 🔹 Lógica principal
  // ===========================
  addPlayer(name: string, gender: string): void {
    if (!name?.trim()) return;
    if (this.players.length >= 8) return;
    const validGender = gender === 'male' || gender === 'female' ? gender : 'female';
    this.players.push({ name: name.trim(), gender: validGender });
  }

  removePlayer(index: number): void {
    this.players.splice(index, 1);
  }

  startGame(): void {
    if (this.players.length < 2) return;
    this.currentPlayerIndex = 0;
    this.currentPlayerName = this.players[this.currentPlayerIndex].name;
    this.currentPhase = 'spinning';
    this.resetRound();
  }

  spinRoulettes(): void {
    if (this.spinningBody || this.spinningPlayer || this.spinningAction) return;
    this.resetRound();
    this.spinningBody = this.spinningPlayer = true;
    if (this.extremeMode) this.spinningAction = true;

    Promise.all([
      this.spinBodyPart(),
      this.spinPlayer(),
      this.extremeMode ? this.spinAction() : Promise.resolve()
    ]).then(() => {
      this.spinningBody = this.spinningPlayer = this.spinningAction = false;
      this.buildResultMessage();
      this.currentPhase = 'result';
    });
  }

  private spinBodyPart(): Promise<void> {
    return new Promise(resolve => {
      const available = this.includeIntimateParts ? this.bodyParts : this.bodyParts.filter(p => !p.isIntimate);
      let spins = 0;
      const iv = setInterval(() => {
        this.currentBodyPart = this.getBodyPartName(available[Math.floor(Math.random() * available.length)]);
        if (++spins > 15) {
          clearInterval(iv);
          resolve();
        }
      }, 100);
    });
  }

  private spinPlayer(): Promise<void> {
    return new Promise(resolve => {
      let spins = 0;
      const iv = setInterval(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.players.length);
        } while (randomIndex === this.currentPlayerIndex && this.players.length > 1);
        this.targetPlayer = this.players[randomIndex].name;
        if (++spins > 15) {
          clearInterval(iv);
          resolve();
        }
      }, 120);
    });
  }

  private spinAction(): Promise<void> {
    return new Promise(resolve => {
      let spins = 0;
      const iv = setInterval(() => {
        const randomAction = this.actions[Math.floor(Math.random() * this.actions.length)];
        this.currentAction = randomAction[this.currentLang()];
        if (++spins > 15) {
          clearInterval(iv);
          resolve();
        }
      }, 120);
    });
  }

  private buildResultMessage(): void {
    const lang = this.currentLang();
    const actor = this.currentPlayerName;
    const target = this.targetPlayer;
    const body = this.currentBodyPart;
    const action = this.currentAction || (lang === 'es' ? 'besar' : 'kiss');

    this.resultMessage =
      lang === 'es'
        ? `💋 A ${actor} le toca ${action} la ${body.toLowerCase()} de ${target}.`
        : `💋 ${actor} must ${action} ${target}'s ${body.toLowerCase()}.`;
  }

  // ===========================
  // 🔹 Cronómetro
  // ===========================
  startKissCountdown(): void {
    this.countdownTime = this.kissDuration;
    this.currentPhase = 'kissCountdown';
    this.countdownActive = true;

    this.countdownInterval = setInterval(() => {
      this.countdownTime--;
      if (this.countdownTime <= 0) {
        this.clearCountdown();
        this.currentPhase = 'result';
      }
    }, 1000);
  }

  clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
      this.countdownActive = false;
    }
  }

  // ===========================
  // 🔹 Helpers dinámicos
  // ===========================
  getDynamicWhereLabel(): string {
    const lang = this.currentLang();
    if (this.currentAction && this.actionWhereMap[this.currentAction]) {
      return this.actionWhereMap[this.currentAction][lang];
    }
    return lang === 'es' ? '¿Dónde?' : 'Where?';
  }

  getDynamicWhoLabel(): string {
    const lang = this.currentLang();
    if (this.currentAction && this.actionWhoMap[this.currentAction]) {
      return this.actionWhoMap[this.currentAction][lang];
    }
    return lang === 'es' ? '¿A quién?' : 'Who?';
  }

  getBodyPartName(part: BodyPart): string {
    return part.name[this.currentLang()] || part.name.es;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getDynamicStartButtonLabel(): string {
    const lang = this.currentLang();
    if (this.currentPhase === 'setup') return lang === 'es' ? 'Iniciar juego' : 'Start game';
    if (this.currentPhase === 'spinning') return lang === 'es' ? 'Girando...' : 'Spinning...';
    if (this.currentPhase === 'kissCountdown') return lang === 'es' ? 'Detener beso' : 'Stop kiss';
    if (this.currentPhase === 'result') return lang === 'es' ? 'Siguiente turno' : 'Next turn';
    return lang === 'es' ? 'Continuar' : 'Continue';
  }

  nextTurn(): void {
    this.clearCountdown();
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.currentPlayerName = this.players[this.currentPlayerIndex].name;
    this.currentPhase = 'spinning';
    this.resetRound();
  }

  resetRound(): void {
    this.currentBodyPart = '';
    this.targetPlayer = '';
    this.currentAction = '';
    this.resultMessage = '';
    this.spinningBody = this.spinningPlayer = this.spinningAction = false;
  }

  resetGame(): void {
    this.clearCountdown();
    this.currentPhase = 'setup';
    this.resetRound();
  }
  canStartGame(): boolean {
    return this.players.length >= 2;
  }
  updateKissDuration(seconds: number): void {
    this.kissDuration = seconds;
  }
  showInstructionsAgain(): void {
    this.showInstructions = true;
  }

  closeInstructions(): void {
    this.showInstructions = false;
  }

  getStartTimerButtonLabel(): string {
    const lang = this.currentLang();
    const time = this.formatTime(this.kissDuration);
    return lang === 'es'
      ? `Iniciar ${time}`
      : `Start ${time}`;
  }

  closeGame(): void {
    // Aquí puedes agregar lógica para cerrar el juego
    // Por ejemplo, navegar a otra página o cerrar el componente
    console.log('Juego cerrado');
    this.resetGame();
  }

  // ===========================
  // 🔹 Manejar cambio de modo extremo
  // ===========================
  onExtremeModeChange(): void {
    if (this.extremeMode) {
      // Cuando se activa el modo extremo, automáticamente activar partes íntimas
      this.includeIntimateParts = true;
    }
    // Cuando se desactiva el modo extremo, dejar el checkbox de partes íntimas como estaba
  }
}
