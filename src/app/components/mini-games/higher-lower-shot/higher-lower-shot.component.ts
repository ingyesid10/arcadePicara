import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface Player {
  name: string;
  gender: 'male' | 'female';
}

interface Card {
  value: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-higher-lower-shot',
  templateUrl: './higher-lower-shot.component.html',
  styleUrls: ['./higher-lower-shot.component.css']
})
export class HigherLowerShotComponent implements OnInit, OnDestroy {
  // Configuración
  players: Player[] = [];
  gameMode: 'simple' | 'roulette' | null = null;
  showInstructions = false;
  
  // Estados del juego
  currentPhase: 'modeSelection' | 'setup' | 'spinning' | 'cardReveal' | 'result' = 'modeSelection';
  playerA: Player | null = null;
  playerB: Player | null = null;
  currentCard: Card | null = null;
  nextCard: Card | null = null;
  playerGuess: 'higher' | 'lower' | null = null;
  gameResult: 'win' | 'lose' | 'tie' | null = null;
  
  // Ruletas
  spinningPlayerA = false;
  spinningPlayerB = false;
  
  // Cartas
  firstCardRevealed = false;
  secondCardRevealed = false;
  showingResult = false;
  
  // Traducciones
  labels: any = {};
  private langSub?: Subscription;

  // Mazo de cartas (12 cartas: A, 2-10, J, Q) - ELIMINADA LA K
  cards: Card[] = [
    { value: 1, name: 'A', image: 'assets/img/cards/01.svg' },
    { value: 2, name: '2', image: 'assets/img/cards/02.svg' },
    { value: 3, name: '3', image: 'assets/img/cards/03.svg' },
    { value: 4, name: '4', image: 'assets/img/cards/04.svg' },
    { value: 5, name: '5', image: 'assets/img/cards/05.svg' },
    { value: 6, name: '6', image: 'assets/img/cards/06.svg' },
    { value: 7, name: '7', image: 'assets/img/cards/07.svg' },
    { value: 8, name: '8', image: 'assets/img/cards/08.svg' },
    { value: 9, name: '9', image: 'assets/img/cards/09.svg' },
    { value: 10, name: '10', image: 'assets/img/cards/10.svg' },
    { value: 11, name: '11', image: 'assets/img/cards/11.svg' },
    { value: 12, name: '12', image: 'assets/img/cards/12.svg' }
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.loadTranslations();
    this.langSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadTranslations();
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  private loadTranslations() {
    this.translate.get('HIGHER_LOWER_SHOT').subscribe((res) => {
      this.labels = res;
    });
  }

  // Seleccionar modo de juego
  selectGameMode(mode: 'simple' | 'roulette') {
    this.gameMode = mode;
    if (mode === 'simple') {
      this.currentPhase = 'cardReveal';
      this.drawFirstCard();
    } else {
      this.currentPhase = 'setup';
    }
  }

  // Agregar jugador (solo para modo ruleta)
  addPlayer(name: string, gender: string) {
    if (name.trim() && this.players.length < 8) {
      const validGender = gender === 'male' || gender === 'female' ? gender : 'female';
      this.players.push({ 
        name: name.trim(), 
        gender: validGender 
      });
    }
  }

  // Remover jugador (solo para modo ruleta)
  removePlayer(index: number) {
    this.players.splice(index, 1);
  }

  // Cerrar instrucciones
  closeInstructions() {
    this.showInstructions = false;
  }

  // Mostrar instrucciones nuevamente
  showInstructionsAgain() {
    this.showInstructions = true;
  }

  // Iniciar juego (solo para modo ruleta)
  startGame() {
    if (this.canStartGame()) {
      this.currentPhase = 'spinning';
    }
  }

  // Girar ruletas para modo ruleta
  spinRoulettes() {
    this.spinningPlayerA = true;
    this.spinningPlayerB = true;
    this.spinPlayerA();
  }

  // Girar ruleta para jugador A
  spinPlayerA() {
    let spins = 0;
    const maxSpins = 15;
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.players.length);
      this.playerA = this.players[randomIndex];
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        this.spinningPlayerA = false;
        this.spinPlayerB();
      }
    }, 150);
  }

  // Girar ruleta para jugador B
  spinPlayerB() {
    let spins = 0;
    const maxSpins = 15;
    
    const interval = setInterval(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * this.players.length);
      } while (this.playerA && randomIndex === this.players.indexOf(this.playerA) && this.players.length > 1);
      
      this.playerB = this.players[randomIndex];
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        this.spinningPlayerB = false;
        this.currentPhase = 'cardReveal';
        this.drawFirstCard();
      }
    }, 150);
  }

  // Sacar primera carta
  drawFirstCard() {
    this.currentCard = this.getRandomCard();
    this.firstCardRevealed = false;
    this.secondCardRevealed = false;
    this.showingResult = false;
    this.playerGuess = null;
    this.gameResult = null;
  }

  // Revelar primera carta
  revealFirstCard() {
    this.firstCardRevealed = true;
  }

  // Hacer predicción
  makeGuess(guess: 'higher' | 'lower') {
    this.playerGuess = guess;
    this.nextCard = this.getRandomCard();
    this.checkResult();
  }

  // Verificar resultado
  checkResult() {
    if (!this.currentCard || !this.nextCard || !this.playerGuess) return;

    const currentValue = this.currentCard.value;
    const nextValue = this.nextCard.value;

    if (currentValue === nextValue) {
      this.gameResult = 'tie';
    } else if (
      (this.playerGuess === 'higher' && nextValue > currentValue) ||
      (this.playerGuess === 'lower' && nextValue < currentValue)
    ) {
      this.gameResult = 'win';
    } else {
      this.gameResult = 'lose';
    }

    this.secondCardRevealed = true;
  }

  // Cuando termina la animación del flip de la segunda carta
  onSecondCardFlipComplete() {
    if (this.secondCardRevealed && !this.showingResult) {
      setTimeout(() => {
        this.showingResult = true;
        this.currentPhase = 'result';
      }, 500);
    }
  }

  // Obtener carta aleatoria
  getRandomCard(): Card {
    const randomIndex = Math.floor(Math.random() * this.cards.length);
    return { ...this.cards[randomIndex] };
  }

  // Siguiente ronda
  nextRound() {
    if (this.gameMode === 'simple') {
      this.drawFirstCard();
      this.currentPhase = 'cardReveal';
    } else {
      this.playerA = null;
      this.playerB = null;
      this.currentCard = null;
      this.nextCard = null;
      this.playerGuess = null;
      this.gameResult = null;
      this.firstCardRevealed = false;
      this.secondCardRevealed = false;
      this.showingResult = false;
      this.currentPhase = 'spinning';
    }
  }

  // Volver a selección de modo
  backToModeSelection() {
    this.currentPhase = 'modeSelection';
    this.gameMode = null;
    this.players = [];
    this.playerA = null;
    this.playerB = null;
    this.currentCard = null;
    this.nextCard = null;
    this.playerGuess = null;
    this.gameResult = null;
    this.firstCardRevealed = false;
    this.secondCardRevealed = false;
    this.showingResult = false;
    this.spinningPlayerA = false;
    this.spinningPlayerB = false;
  }

  // Verificar si puede iniciar el juego (solo modo ruleta)
  canStartGame(): boolean {
    return this.gameMode === 'roulette' && this.players.length >= 3;
  }

  // Obtener mensaje de resultado
  getResultMessage(): string {
    if (!this.gameResult) return '';
    
    const messages = this.labels.RESULT || {};
    
    switch (this.gameResult) {
      case 'win':
        return messages.WIN || '¡Ganaste!';
      case 'lose':
        return messages.LOSE || '¡Perdiste!';
      case 'tie':
        return messages.TIE || '¡Empate!';
      default:
        return '';
    }
  }

  // Obtener instrucción de quién bebe
  getDrinkInstruction(): string {
    if (!this.gameResult) return '';
    
    const messages = this.labels.RESULT || {};
    
    switch (this.gameResult) {
      case 'win':
        if (this.gameMode === 'simple') {
          return messages.DRINK_A_SIMPLE || 'Jugador 1 bebe';
        } else {
          return this.playerA ? 
            (messages.DRINK_A || '{{player}} bebe').replace('{{player}}', this.playerA.name) : 
            'Jugador A bebe';
        }
      case 'lose':
        if (this.gameMode === 'simple') {
          return messages.DRINK_B_SIMPLE || 'Jugador 2 bebe';
        } else {
          return this.playerB ? 
            (messages.DRINK_B || '{{player}} bebe').replace('{{player}}', this.playerB.name) : 
            'Jugador B bebe';
        }
      case 'tie':
        return messages.DRINK_BOTH || '¡Ambos beben!';
      default:
        return '';
    }
  }
}