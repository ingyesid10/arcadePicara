import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface Confession {
  text: { es: string; en: string };
  type: 'nunca' | 'reto' | 'verdad';
  level: 'travieso' | 'hot' | 'extremo';
  emoji: string;
}

@Component({
  selector: 'app-hot-confessions',
  templateUrl: './hot-confessions.component.html',
  styleUrls: ['./hot-confessions.component.css']
})
export class HotConfessionsComponent implements OnInit, OnDestroy {

  currentPhase: 'setup' | 'playing' = 'setup';
  selectedTypes: Set<string> = new Set(['nunca', 'reto', 'verdad']);
  selectedLevels: Set<string> = new Set(['travieso', 'hot']);
  showInstructions = false;
  flipped = false;
  animating = false;
  currentCard: Confession | null = null;
  usedIndices: number[] = [];
  cardsFlipped = 0;
  private langSub?: Subscription;

  allCards: Confession[] = [
    // ── NUNCA NUNCA ──────────────────────────────────
    { text: { es: 'Nunca he tenido sexo en un coche 🚗', en: 'I have never had sex in a car 🚗' }, type: 'nunca', level: 'travieso', emoji: '🚗' },
    { text: { es: 'Nunca he mandado una foto picante 📸', en: 'I have never sent a spicy photo 📸' }, type: 'nunca', level: 'travieso', emoji: '📸' },
    { text: { es: 'Nunca he besado a más de una persona en la misma noche 💋', en: 'I have never kissed more than one person on the same night 💋' }, type: 'nunca', level: 'travieso', emoji: '💋' },
    { text: { es: 'Nunca he tenido una fantasía con alguien del grupo 🙈', en: 'I have never had a fantasy about someone in this group 🙈' }, type: 'nunca', level: 'travieso', emoji: '🙈' },
    { text: { es: 'Nunca he hecho striptease para alguien 💃', en: 'I have never given a striptease 💃' }, type: 'nunca', level: 'travieso', emoji: '💃' },
    { text: { es: 'Nunca he mentido para ligar con alguien 😅', en: 'I have never lied to flirt with someone 😅' }, type: 'nunca', level: 'travieso', emoji: '😅' },
    { text: { es: 'Nunca he tenido sexo en un espacio semipúblico 😱', en: 'I have never had sex in a semi-public space 😱' }, type: 'nunca', level: 'hot', emoji: '😱' },
    { text: { es: 'Nunca he usado un juguete íntimo 🔥', en: 'I have never used an intimate toy 🔥' }, type: 'nunca', level: 'hot', emoji: '🔥' },
    { text: { es: 'Nunca he hecho sexo oral en un lugar poco convencional 😈', en: 'I have never had oral sex in an unconventional place 😈' }, type: 'nunca', level: 'hot', emoji: '😈' },
    { text: { es: 'Nunca he grabado o recibido un audio o video íntimo 📹', en: 'I have never recorded or received an intimate audio or video 📹' }, type: 'nunca', level: 'hot', emoji: '📹' },
    { text: { es: 'Nunca he cumplido una fantasía con alguien desconocido 🎭', en: 'I have never acted out a fantasy with a stranger 🎭' }, type: 'nunca', level: 'extremo', emoji: '🎭' },
    { text: { es: 'Nunca he tenido un encuentro con más de una persona al mismo tiempo 💥', en: 'I have never been with more than one person at the same time 💥' }, type: 'nunca', level: 'extremo', emoji: '💥' },
    { text: { es: 'Nunca he explorado la dominación o sumisión 🔗', en: 'I have never explored dominance or submission 🔗' }, type: 'nunca', level: 'extremo', emoji: '🔗' },
    { text: { es: 'Nunca he actuado un roleplay disfrazado 🎪', en: 'I have never done a roleplay in costume 🎪' }, type: 'nunca', level: 'extremo', emoji: '🎪' },

    // ── RETOS ────────────────────────────────────────
    { text: { es: 'Pon tu mano en el muslo de la persona a tu derecha durante 10 segundos 🤭', en: 'Put your hand on the thigh of the person to your right for 10 seconds 🤭' }, type: 'reto', level: 'travieso', emoji: '🤭' },
    { text: { es: 'Imita en silencio tu mejor cara de placer 😏', en: 'Silently imitate your best pleasure face 😏' }, type: 'reto', level: 'travieso', emoji: '😏' },
    { text: { es: 'Da un masaje de hombros de 30 segundos a quien elija el grupo 💆', en: 'Give a 30-second shoulder massage to who the group chooses 💆' }, type: 'reto', level: 'travieso', emoji: '💆' },
    { text: { es: 'Susurra al oído de alguien del grupo algo que te parezca atractivo de él/ella 👂', en: 'Whisper in someone\'s ear something you find attractive about them 👂' }, type: 'reto', level: 'travieso', emoji: '👂' },
    { text: { es: 'Haz tu mejor estriptease de 20 segundos sin quitarte ropa 🕺', en: 'Do your best 20-second striptease without removing clothes 🕺' }, type: 'reto', level: 'travieso', emoji: '🕺' },
    { text: { es: 'Describe en voz alta tu postura favorita sin usar el nombre 🔥', en: 'Describe your favorite position out loud without naming it 🔥' }, type: 'reto', level: 'hot', emoji: '🔥' },
    { text: { es: 'Besa al aire de forma seductora durante 5 segundos 💋', en: 'Kiss the air seductively for 5 seconds 💋' }, type: 'reto', level: 'hot', emoji: '💋' },
    { text: { es: 'Convence a alguien del grupo en 30 segundos de que eres irresistible 😈', en: 'Convince someone in the group in 30 seconds that you are irresistible 😈' }, type: 'reto', level: 'hot', emoji: '😈' },
    { text: { es: 'Revela cuántas personas has besado en tu vida y el grupo decide si bebe 🍻', en: 'Reveal how many people you\'ve kissed and the group decides who drinks 🍻' }, type: 'reto', level: 'hot', emoji: '🍻' },
    { text: { es: 'Actúa como una stripper / gigoló durante 1 minuto con música que ponga el grupo 🎵', en: 'Act like a stripper / gigolo for 1 minute with music chosen by the group 🎵' }, type: 'reto', level: 'extremo', emoji: '🎵' },
    { text: { es: 'Elige a alguien del grupo y explica exactamente qué harías con él/ella si estuvierais solos 🔥', en: 'Pick someone in the group and explain exactly what you\'d do with them if alone 🔥' }, type: 'reto', level: 'extremo', emoji: '🔥' },
    { text: { es: 'Haz tu actitud más seductora con la persona de tu izquierda durante 30 segundos mientras mantiene contacto visual 👁️', en: 'Use your most seductive attitude on the person to your left for 30 seconds while maintaining eye contact 👁️' }, type: 'reto', level: 'extremo', emoji: '👁️' },

    // ── VERDADES ─────────────────────────────────────
    { text: { es: '¿Cuál es tu zona erógena favorita? 🔥', en: 'What is your favorite erogenous zone? 🔥' }, type: 'verdad', level: 'travieso', emoji: '🔥' },
    { text: { es: '¿Has pensado alguna vez en alguien del grupo de forma romántica? 🙈', en: 'Have you ever thought about someone in this group romantically? 🙈' }, type: 'verdad', level: 'travieso', emoji: '🙈' },
    { text: { es: '¿Cuánto tardas en saber si alguien te gusta físicamente? 😏', en: 'How long does it take you to know if you are physically attracted to someone? 😏' }, type: 'verdad', level: 'travieso', emoji: '😏' },
    { text: { es: '¿Cuál es la parte del cuerpo que más te gusta de ti mismo/a? 💋', en: 'What is the body part you like most about yourself? 💋' }, type: 'verdad', level: 'travieso', emoji: '💋' },
    { text: { es: '¿Cuál es la fantasía sexual que aún no has cumplido y más deseas? 🌶️', en: 'What is the sexual fantasy you have not fulfilled yet but desire most? 🌶️' }, type: 'verdad', level: 'hot', emoji: '🌶️' },
    { text: { es: '¿Has fingido alguna vez? Sé honesto/a 😅', en: 'Have you ever faked it? Be honest 😅' }, type: 'verdad', level: 'hot', emoji: '😅' },
    { text: { es: '¿Cuál es el lugar más inusual donde lo has hecho? 🗺️', en: 'What is the most unusual place where you have done it? 🗺️' }, type: 'verdad', level: 'hot', emoji: '🗺️' },
    { text: { es: '¿Cuántas personas conoces en este grupo con las que te plantearías algo íntimo? No digas quiénes 😈', en: 'How many people in this group would you consider something intimate with? Don\'t say who 😈' }, type: 'verdad', level: 'hot', emoji: '😈' },
    { text: { es: '¿Cuál es tu fetiche que menos gente sabe? 🤫', en: 'What is your fetish that the fewest people know about? 🤫' }, type: 'verdad', level: 'extremo', emoji: '🤫' },
    { text: { es: '¿Cuál es la cosa más atrevida que has hecho para conquistar a alguien? 💥', en: 'What is the most daring thing you have ever done to attract someone? 💥' }, type: 'verdad', level: 'extremo', emoji: '💥' },
    { text: { es: '¿Serías capaz de hacer un striptease real delante de todos los que estáis aquí ahora mismo? 👀', en: 'Would you be capable of doing a real striptease in front of everyone here right now? 👀' }, type: 'verdad', level: 'extremo', emoji: '👀' },
    { text: { es: 'Si pudieras pasar una noche con alguien de este grupo sin consecuencias, ¿con quién sería? 🔥', en: 'If you could spend a night with someone in this group without consequences, who would it be? 🔥' }, type: 'verdad', level: 'extremo', emoji: '🔥' },
  ];

  levelColors: Record<string, string> = {
    travieso: '#f7c948',
    hot:      '#ff6b35',
    extremo:  '#d62246'
  };

  typeColors: Record<string, string> = {
    nunca:  '#4fc3f7',
    reto:   '#ff6b35',
    verdad: '#f06292'
  };

  typeLabels: Record<string, { es: string; en: string }> = {
    nunca:  { es: '🍻 Nunca Nunca', en: '🍻 Never Have I Ever' },
    reto:   { es: '⚡ Reto',        en: '⚡ Dare'             },
    verdad: { es: '💬 Verdad',      en: '💬 Truth'            }
  };

  levelLabels: Record<string, { es: string; en: string }> = {
    travieso: { es: '💛 Travieso', en: '💛 Naughty' },
    hot:      { es: '🧡 Hot',      en: '🧡 Hot'     },
    extremo:  { es: '❤️ Extremo',  en: '❤️ Extreme' }
  };

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

  get typeList() { return ['nunca', 'reto', 'verdad']; }
  get levelList() { return ['travieso', 'hot', 'extremo']; }

  toggleType(t: string) {
    if (this.selectedTypes.has(t)) {
      if (this.selectedTypes.size > 1) this.selectedTypes.delete(t);
    } else {
      this.selectedTypes.add(t);
    }
  }

  toggleLevel(l: string) {
    if (this.selectedLevels.has(l)) {
      if (this.selectedLevels.size > 1) this.selectedLevels.delete(l);
    } else {
      this.selectedLevels.add(l);
    }
  }

  get filteredCards(): Confession[] {
    return this.allCards.filter(c =>
      this.selectedTypes.has(c.type) && this.selectedLevels.has(c.level)
    );
  }

  startGame() {
    this.usedIndices = [];
    this.cardsFlipped = 0;
    this.currentPhase = 'playing';
    this.drawCard();
  }

  drawCard(): void {
    if (this.animating) return;
    let available = this.filteredCards
      .map((_, i) => i)
      .filter(i => !this.usedIndices.includes(i));

    if (available.length === 0) {
      this.usedIndices = [];
      available = this.filteredCards.map((_, i) => i);
    }

    const pick = available[Math.floor(Math.random() * available.length)];
    this.usedIndices.push(pick);

    this.animating = true;
    this.flipped = false;

    setTimeout(() => {
      this.currentCard = this.filteredCards[pick];
      this.flipped = true;
      this.cardsFlipped++;
      this.animating = false;
    }, 400);
  }

  backToSetup() {
    this.currentPhase = 'setup';
    this.currentCard = null;
    this.flipped = false;
    this.usedIndices = [];
    this.cardsFlipped = 0;
  }

  typeLabel(t: string): string {
    return this.typeLabels[t]?.[this.lang] ?? t;
  }

  typeColor(t: string): string {
    return this.typeColors[t] ?? '#fff';
  }

  levelLabel(l: string): string {
    return this.levelLabels[l]?.[this.lang] ?? l;
  }

  levelColor(l: string): string {
    return this.levelColors[l] ?? '#fff';
  }
}
