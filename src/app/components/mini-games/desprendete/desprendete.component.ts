import { Component, OnInit, OnDestroy } from '@angular/core';
import { CombinacionesService } from 'src/app/core/services/combinaciones.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface Player {
  id: number;
  name: string;
  clothes: number;
  completedChallenges: number;
}

interface GameState {
  currentPlayer: number;
  players: Player[];
  gameStarted: boolean;
  firstSpinDone: boolean;
}

@Component({
  selector: 'app-desprendete',
  templateUrl: './desprendete.component.html',
  styleUrls: ['./desprendete.component.css'],
})
export class DesprendeteComponent implements OnInit, OnDestroy {
  segments: string[] = [];
  currentSegmentIndex = 0;
  currentSegmentDisplay = '';
  showResult = false;
  resultName = '';
  resultDesc = '';
  finalResultType = '';

  modalSeconds = 30;
  countdownRemaining = 30;
  hasSpun = false;
  isSpinning = false;
  countdownActive = false;
  showRules = false;

  gameState: GameState = {
    currentPlayer: 0,
    players: [],
    gameStarted: false,
    firstSpinDone: false,
  };

  showSmallRoulette = false;
  smallRouletteSpinning = false;
  smallRouletteResult = '';

  truths: string[] = [];
  challenges: string[] = [];

  private spinInterval: any = null;
  private countdownInterval: any = null;
  private smallSpinInterval: any = null;
  private langSubscription!: Subscription;

  constructor(
    private combinacionesService: CombinacionesService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.setSegments();
    this.loadGameData();

    // Detectar cambio de idioma
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.setSegments();
      this.loadGameData();
    });
  }

  ngOnDestroy() {
    this.clearAllIntervals();
    if (this.langSubscription) this.langSubscription.unsubscribe();
  }

  /** Definir segmentos según idioma */
  setSegments() {
    const lang = this.translate.currentLang || 'es';
    this.segments =
      lang === 'es' ? ['VERDAD', 'RETO'] : ['TRUTH', 'CHALLENGE'];
  }

  /** Cargar datos del JSON según idioma */
  loadGameData() {
    const lang = this.translate.currentLang || 'es';
    this.combinacionesService.getVerdadRetoExtremo(lang as 'es' | 'en').subscribe({
      next: (data) => {
        this.truths = data.preguntas || data.truths || [];
        this.challenges = data.retos || data.challenges || [];
      },
      error: () => {
        // Valores por defecto si falla el JSON
        if (lang === 'es') {
          this.truths = [
            "¿Con quién de los presentes te gustaría tener una cita secreta?",
            "¿Cuál es tu parte del cuerpo favorita y por qué?",
            "¿Qué es lo más atrevido que has hecho en una fiesta?",
            "¿A quién le darías un beso si tuvieras que elegir ahora?",
            "¿Qué fantasía aún no has cumplido?"
          ];
          this.challenges = [
            "Dale un abrazo muy apretado a la persona a tu derecha durante 10 segundos.",
            "Susurra algo coqueto al oído de alguien.",
            "Baila lentamente con la persona que el grupo elija.",
            "Deja que alguien dibuje un corazón en tu brazo con lápiz labial.",
            "Haz un piropo divertido al jugador que elijas."
          ];
        } else {
          this.truths = [
            "Who would you like to have a secret date with among the present players?",
            "What's your favorite body part and why?",
            "What's the boldest thing you've done at a party?",
            "Who would you kiss if you had to choose now?",
            "Which fantasy have you not fulfilled yet?"
          ];
          this.challenges = [
            "Give a tight hug to the person on your right for 10 seconds.",
            "Whisper something flirty into someone's ear.",
            "Slowly dance with the person chosen by the group.",
            "Let someone draw a heart on your arm with lipstick.",
            "Give a funny compliment to a chosen player."
          ];
        }
      }
    });
  }

  addPlayer() {
    if (this.gameState.players.length < 8) {
      const newId = this.gameState.players.length + 1;
      let newPlayerClothes = 8;
      if (this.gameState.firstSpinDone && this.gameState.players.length > 0) {
        const minClothes = Math.min(...this.gameState.players.map(p => p.clothes));
        newPlayerClothes = Math.max(1, minClothes - 1);
      }
      this.gameState.players.push({
        id: newId,
        name: `Player ${newId}`,
        clothes: newPlayerClothes,
        completedChallenges: 0
      });
    }
  }

  removePlayer(index: number) {
    if (this.gameState.players.length > 2) {
      this.gameState.players.splice(index, 1);
      if (this.gameState.currentPlayer >= this.gameState.players.length) {
        this.gameState.currentPlayer = 0;
      }
    }
  }

  startSpin() {
    if (this.gameState.players.length < 2) {
      alert(this.translate.instant('desprendete.needTwoPlayers'));
      return;
    }
    this.clearAllIntervals();
    this.showResult = false;
    this.finalResultType = '';
    this.hasSpun = true;
    this.isSpinning = true;
    this.countdownRemaining = this.modalSeconds;
    this.playSpinSound();

    let spinCount = 0;
    const maxDuration = 3000;
    const startTime = Date.now();
    let spinSpeed = 40;

    const spin = () => {
      const elapsed = Date.now() - startTime;
      this.currentSegmentIndex = (this.currentSegmentIndex + 1) % this.segments.length;
      this.currentSegmentDisplay = this.segments[this.currentSegmentIndex];
      spinCount++;

      if (elapsed > 2000) spinSpeed = Math.min(300, spinSpeed + 100);
      if (elapsed < maxDuration) {
        this.spinInterval = setTimeout(spin, spinSpeed);
      } else {
        this.finalizeSpin();
      }
    };
    this.spinInterval = setTimeout(spin, spinSpeed);
  }

  finalizeSpin() {
    clearTimeout(this.spinInterval);
    this.isSpinning = false;

    const finalIndex = Math.floor(Math.random() * this.segments.length);
    this.currentSegmentIndex = finalIndex;
    this.currentSegmentDisplay = this.segments[finalIndex];

    setTimeout(() => {
      this.finalizeResult(finalIndex);
      this.playResultSound();
      if (!this.gameState.firstSpinDone) {
        this.gameState.firstSpinDone = true;
        this.gameState.gameStarted = true;
      }
    }, 300);
  }

  finalizeResult(index: number) {
    this.showResult = true;
    const segment = this.segments[index];
    this.finalResultType = segment;
    this.resultName = this.getCurrentPlayer().name;

    if (segment === this.translate.instant('desprendete.truth')) {
      const randomIndex = Math.floor(Math.random() * this.truths.length);
      this.resultDesc = this.truths[randomIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * this.challenges.length);
      this.resultDesc = this.challenges[randomIndex];
    }
  }

  startCountdown() {
    if (!this.hasSpun) { this.startSpin(); return; }
    if (this.finalResultType !== this.translate.instant('desprendete.challenge') || !this.showResult) return;
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.countdownActive = true;
    this.countdownRemaining = this.modalSeconds;

    this.countdownInterval = setInterval(() => {
      this.countdownRemaining--;
      if (this.countdownRemaining <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownActive = false;
        this.removeClothing(this.getCurrentPlayer(), 1);
        this.nextPlayer();
        this.resetRound();
      }
    }, 1000);
  }

  canStartTimer(): boolean {
    if (!this.hasSpun) return this.gameState.players.length >= 2;
    return this.showResult &&
           this.finalResultType === this.translate.instant('desprendete.challenge') &&
           !this.countdownActive &&
           this.gameState.players.length >= 2;
  }

  getStartButtonText(): string {
    if (!this.hasSpun) return this.translate.instant('desprendete.start');
    if (this.countdownActive) return this.translate.instant('desprendete.running');
    return this.translate.instant('desprendete.start');
  }

  canSpin(): boolean {
    return this.gameState.players.length >= 2 && !this.isSpinning;
  }

  isGameReady(): boolean {
    return this.gameState.players.length >= 2;
  }

  completeChallenge() {
    if (this.finalResultType === this.translate.instant('desprendete.challenge')) {
      const player = this.getCurrentPlayer();
      player.completedChallenges++;
      if (player.completedChallenges >= 2) this.showSmallRoulette = true;
      else this.nextPlayer();
    } else this.nextPlayer();
    this.resetRound();
  }

  passChallenge() {
    this.removeClothing(this.getCurrentPlayer(), 1);
    this.nextPlayer();
    this.resetRound();
  }

  removeClothing(player: Player, amount: number = 1) {
    player.clothes = Math.max(0, player.clothes - amount);
    if (player.clothes === 0) {
      setTimeout(() => {
        alert(this.translate.instant('desprendete.noClothes', { name: player.name }));
      }, 500);
    }
  }

  spinSmallRoulette() {
    this.smallRouletteSpinning = true;
    this.smallRouletteResult = '';
    let fakeSpinCount = 0;
    const maxFakeSpins = 15;

    this.smallSpinInterval = setInterval(() => {
      const randomPlayer = this.gameState.players[Math.floor(Math.random() * this.gameState.players.length)];
      this.smallRouletteResult = randomPlayer.name;
      fakeSpinCount++;
      if (fakeSpinCount >= maxFakeSpins) {
        clearInterval(this.smallSpinInterval);
        setTimeout(() => this.finalizeSmallRoulette(), 300);
      }
    }, 100);
  }

  finalizeSmallRoulette() {
    this.smallRouletteSpinning = false;
    const availablePlayers = this.gameState.players.filter(p => p.id !== this.getCurrentPlayer().id);
    const targetPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    this.smallRouletteResult = targetPlayer.name;
    this.removeClothing(targetPlayer, 1);
    setTimeout(() => {
      this.showSmallRoulette = false;
      this.nextPlayer();
      this.resetRound();
    }, 2000);
  }

  nextPlayer() {
    this.gameState.currentPlayer = (this.gameState.currentPlayer + 1) % this.gameState.players.length;
  }

  getCurrentPlayer(): Player {
    return this.gameState.players[this.gameState.currentPlayer];
  }

  resetRound() {
    this.clearAllIntervals();
    this.showResult = false;
    this.finalResultType = '';
    this.currentSegmentDisplay = '';
    this.hasSpun = false;
    this.isSpinning = false;
    this.countdownActive = false;
    this.countdownRemaining = this.modalSeconds;
  }

  resetGame() {
    this.clearAllIntervals();
    this.gameState = {
      currentPlayer: 0,
      players: this.gameState.players.map(p => ({ ...p, clothes: 8, completedChallenges: 0 })),
      gameStarted: false,
      firstSpinDone: false
    };
    this.showResult = false;
    this.finalResultType = '';
    this.showSmallRoulette = false;
    this.showRules = false;
    this.currentSegmentDisplay = '';
    this.countdownRemaining = this.modalSeconds;
    this.hasSpun = false;
    this.isSpinning = false;
    this.countdownActive = false;
  }

  clearAllIntervals() {
    if (this.spinInterval) clearInterval(this.spinInterval);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownActive = false;
    if (this.smallSpinInterval) clearInterval(this.smallSpinInterval);
  }

  formatTimer(sec: number) {
    const s = Math.max(0, Math.floor(sec || 0));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  isGameOver(): boolean {
    return this.gameState.players.filter(p => p.clothes > 0).length <= 1;
  }

  getWinner(): string {
    const winner = this.gameState.players.find(p => p.clothes > 0);
    return winner ? winner.name : this.translate.instant('desprendete.noWinner');
  }

  validatePlayerName(index: number) {
    const player = this.gameState.players[index];
    if (!player.name || player.name.trim() === '') player.name = `Player ${player.id}`;
    else player.name = player.name.substring(0, 15);
  }

  playSpinSound() { console.log('🎵 Ruleta girando...'); }
  playResultSound() { console.log('🎵 Resultado mostrado...'); }
}
