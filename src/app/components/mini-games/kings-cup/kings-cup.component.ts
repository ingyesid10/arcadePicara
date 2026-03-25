import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface KingRule {
  card: string;
  name: { es: string; en: string };
  rule: { es: string; en: string };
  emoji: string;
  color: string;
}

@Component({
  selector: 'app-kings-cup',
  templateUrl: './kings-cup.component.html',
  styleUrls: ['./kings-cup.component.css']
})
export class KingsCupComponent implements OnInit, OnDestroy {

  currentPhase: 'setup' | 'playing' = 'setup';
  showInstructions = false;
  flipped = false;
  animating = false;
  currentRule: KingRule | null = null;
  usedCards: string[] = [];
  cardsDrawn = 0;

  private langSub?: Subscription;

  readonly TOTAL_CARDS = 13;

  // Reglas del King's Cup / Ring of Fire adaptadas a adultos con toque hot
  rules: KingRule[] = [
    {
      card: 'A', emoji: '🍺',
      name:  { es: 'As — Cascada',        en: 'Ace — Waterfall'         },
      rule:  { es: 'Todos beben a la vez y nadie puede parar hasta que la persona a su izquierda lo haga. El primero que empieza puede parar cuando quiera.',
               en: 'Everyone drinks at the same time and cannot stop until the person to their left does. The first player can stop whenever they want.' },
      color: '#4fc3f7'
    },
    {
      card: '2', emoji: '👉',
      name:  { es: '2 — Tú',             en: '2 — You'                  },
      rule:  { es: 'Elige a alguien del grupo para que beba. O bien hazle una pregunta hot y si no responde, bebe.',
               en: 'Choose someone to drink. Or ask them a hot question — if they refuse to answer, they drink.' },
      color: '#f06292'
    },
    {
      card: '3', emoji: '🪞',
      name:  { es: '3 — Yo',             en: '3 — Me'                   },
      rule:  { es: 'Has sacado el 3, ¡bebe tú! Aprovecha para hacer una breve confesión atrevida o simplemente bebe.',
               en: 'You drew the 3, drink up! Take the chance to make a quick daring confession or just drink.' },
      color: '#ff6b35'
    },
    {
      card: '4', emoji: '🙋‍♀️',
      name:  { es: '4 — Para las chicas', en: '4 — For the girls'       },
      rule:  { es: 'Todas las mujeres del grupo beben. Si solo hay hombres, todos beben.',
               en: 'All women in the group drink. If only men, everyone drinks.' },
      color: '#e91e63'
    },
    {
      card: '5', emoji: '🙋‍♂️',
      name:  { es: '5 — Para los chicos', en: '5 — For the guys'        },
      rule:  { es: 'Todos los hombres del grupo beben. Si solo hay mujeres, todas beben.',
               en: 'All men in the group drink. If only women, everyone drinks.' },
      color: '#1565c0'
    },
    {
      card: '6', emoji: '😈',
      name:  { es: '6 — Para el diablo',  en: '6 — For the devil'       },
      rule:  { es: 'El jugador activo elige una regla hot que dura todo el juego (ej: "el que use el nombre de alguien bebe"). La regla cancela la anterior si había una.',
               en: 'The active player sets a naughty house rule that lasts the whole game (e.g., "whoever uses someone\"s name drinks"). It replaces any previous rule.' },
      color: '#d32f2f'
    },
    {
      card: '7', emoji: '☁️',
      name:  { es: '7 — Cielo',           en: '7 — Heaven'              },
      rule:  { es: 'Todos levantan la mano. El último en levantarla bebe. ¡Ojo al tiempo de reacción!',
               en: 'Everyone raises their hand. Last one to raise it drinks. Watch your reaction time!' },
      color: '#7c4dff'
    },
    {
      card: '8', emoji: '👥',
      name:  { es: '8 — Compañero',       en: '8 — Mate'                },
      rule:  { es: 'Elige un compañero/a de bebida. Durante el resto del juego, cuando uno beba, el otro también bebe.',
               en: 'Choose a drinking mate. For the rest of the game, when one of you drinks, the other does too.' },
      color: '#00897b'
    },
    {
      card: '9', emoji: '🎤',
      name:  { es: '9 — Rima',            en: '9 — Rhyme'               },
      rule:  { es: 'Di una palabra con carga sexual o atrevida. Cada jugador dice otra que rime. El primero que falle o repita, bebe.',
               en: 'Say a naughty or daring word. Each player says one that rhymes. First to fail or repeat drinks.' },
      color: '#f57c00'
    },
    {
      card: '10', emoji: '📝',
      name:  { es: '10 — Categorías',     en: '10 — Categories'         },
      rule:  { es: 'Elige una categoría hot (posiciones, lugares para hacerlo, lencería...). Cada jugador dice un ejemplo. El primero que no sepa, bebe.',
               en: 'Pick a spicy category (positions, places to do it, lingerie types...). Each player names one. First to blank drinks.' },
      color: '#558b2f'
    },
    {
      card: 'J', emoji: '📏',
      name:  { es: 'J — Nunca Nunca',     en: 'J — Never Have I Ever'   },
      rule:  { es: 'El jugador dice "Yo nunca nunca..." y termina la frase con algo atrevido o hot. Todos los que sí lo hayan hecho, beben.',
               en: 'The player says "Never have I ever..." and finishes with something daring or hot. Everyone who HAS done it drinks.' },
      color: '#ad1457'
    },
    {
      card: 'Q', emoji: '💬',
      name:  { es: 'Q — Preguntas',       en: 'Q — Questions'           },
      rule:  { es: 'El jugador hace una pregunta hot a otro. Ese debe responder con otra pregunta. El primero que responda directamente o que tarde +3 segundos, bebe.',
               en: 'The player asks a hot question to someone. They must answer with another question. First to answer directly or hesitate over 3 seconds drinks.' },
      color: '#6a1b9a'
    },
    {
      card: 'K', emoji: '👑',
      name:  { es: 'K — Rey',             en: 'K — King'                },
      rule:  { es: 'Vierte parte de tu bebida en el vaso del centro (la Copa del Rey). El 4.º Rey en salir debe beberse la copa entera. ¡Atrévete!',
               en: 'Pour some of your drink into the center cup (the King\'s Cup). The 4th King drawn must drink the entire cup. Dare you!' },
      color: '#f9a825'
    }
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.langSub = this.translate.onLangChange.subscribe(() => {});
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  get lang(): 'es' | 'en' {
    return (this.translate.currentLang as 'es' | 'en') || 'es';
  }

  get remainingCards(): number {
    return this.TOTAL_CARDS - this.usedCards.length;
  }

  startGame() {
    this.usedCards = [];
    this.cardsDrawn = 0;
    this.currentPhase = 'playing';
    this.drawCard();
  }

  drawCard(): void {
    if (this.animating) return;

    const available = this.rules.filter(r => !this.usedCards.includes(r.card));
    if (available.length === 0) {
      this.usedCards = [];
      this.drawCard();
      return;
    }

    const pick = available[Math.floor(Math.random() * available.length)];
    this.usedCards.push(pick.card);

    this.animating = true;
    this.flipped = false;

    setTimeout(() => {
      this.currentRule = pick;
      this.flipped = true;
      this.cardsDrawn++;
      this.animating = false;
    }, 400);
  }

  backToSetup() {
    this.currentPhase = 'setup';
    this.currentRule = null;
    this.flipped = false;
    this.usedCards = [];
    this.cardsDrawn = 0;
  }
}
