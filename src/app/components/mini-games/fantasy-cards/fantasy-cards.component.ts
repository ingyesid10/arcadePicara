import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface Fantasy {
  text: { es: string; en: string };
  level: 'suave' | 'medio' | 'intenso' | 'extremo';
  emoji: string;
}

@Component({
  selector: 'app-fantasy-cards',
  templateUrl: './fantasy-cards.component.html',
  styleUrls: ['./fantasy-cards.component.css']
})
export class FantasyCardsComponent implements OnInit, OnDestroy {

  currentPhase: 'setup' | 'playing' = 'setup';
  selectedLevels: Set<string> = new Set(['suave', 'medio']);
  flipped = false;
  animating = false;
  currentFantasy: Fantasy | null = null;
  usedIndices: number[] = [];
  labels: any = {};
  private langSub?: Subscription;

  allFantasies: Fantasy[] = [
    // SUAVE
    { text: { es: 'Dale un masaje de 5 minutos en la espalda con aceite 💆', en: 'Give a 5-minute back massage with oil 💆' }, level: 'suave', emoji: '💆' },
    { text: { es: 'Cuéntale tu primera fantasía que tuviste con él/ella', en: 'Tell your first fantasy you had about them' }, level: 'suave', emoji: '💭' },
    { text: { es: 'Bailad pegados durante 3 minutos sin música 💃', en: 'Dance closely for 3 minutes without music 💃' }, level: 'suave', emoji: '💃' },
    { text: { es: 'Susúrrale al oído lo que más te gusta de él/ella 🥰', en: 'Whisper what you love most about them 🥰' }, level: 'suave', emoji: '🥰' },
    { text: { es: 'Haced un striptease de solo 30 segundos 😏', en: 'Do a 30-second striptease 😏' }, level: 'suave', emoji: '😏' },
    { text: { es: 'Daos el beso más largo que podáis sin separar los labios', en: 'Share the longest kiss you can without parting lips' }, level: 'suave', emoji: '💋' },
    { text: { es: 'Descríbele detalladamente cómo sería una noche perfecta contigo', en: 'Describe in detail what a perfect night with you would look like' }, level: 'suave', emoji: '🌙' },
    { text: { es: 'Haced contacto visual sin reír durante 1 minuto 👀', en: 'Hold eye contact without laughing for 1 minute 👀' }, level: 'suave', emoji: '👀' },
    { text: { es: 'Escríbele en la espalda con el dedo una palabra que lo/la defina ✍️', en: 'Write a word on their back with your finger that defines them ✍️' }, level: 'suave', emoji: '✍️' },
    { text: { es: 'Dale 10 besos en distintas partes del cuerpo (no íntimas) 💋', en: 'Give 10 kisses on different body parts (non-intimate) 💋' }, level: 'suave', emoji: '💋' },
    // MEDIO
    { text: { es: 'Confesed una fantasía sexual que aún no hayáis cumplido 🔥', en: 'Confess a sexual fantasy you have not fulfilled yet 🔥' }, level: 'medio', emoji: '🔥' },
    { text: { es: 'Quitadle una prenda de ropa con los ojos cerrados 😈', en: 'Remove one piece of clothing with your eyes closed 😈' }, level: 'medio', emoji: '😈' },
    { text: { es: 'Hazle cosquillas hasta que diga una palabra secreta 🤭', en: 'Tickle them until they say a secret word 🤭' }, level: 'medio', emoji: '🤭' },
    { text: { es: 'Explicad detalladamente vuestra postura favorita según vosotros 😏', en: 'Describe your favorite position in detail 😏' }, level: 'medio', emoji: '😏' },
    { text: { es: 'Vendadle los ojos y que adivine con el tacto qué parte de tu cuerpo toca 🙈', en: 'Blindfold them and let them guess which body part they are touching 🙈' }, level: 'medio', emoji: '🙈' },
    { text: { es: 'Roleplay: durante 2 minutos sed desconocidos que se conocen en un bar 🍸', en: 'Roleplay: be strangers meeting at a bar for 2 minutes 🍸' }, level: 'medio', emoji: '🍸' },
    { text: { es: 'Contad cuántas veces pensasteis en el otro antes de tener vuestra primera cita 💭', en: 'Share how many times you thought about them before your first date 💭' }, level: 'medio', emoji: '💭' },
    { text: { es: 'Lanzaros un desafío de seducción: quien primero sonría pierde 😏', en: 'Seduction challenge: first one to smile loses 😏' }, level: 'medio', emoji: '😏' },
    { text: { es: 'Haced una fantasía de dominación suave: uno ordena, el otro obedece 1 minuto', en: 'Soft dominance fantasy: one orders, the other obeys for 1 minute' }, level: 'medio', emoji: '🔒' },
    { text: { es: 'Describid el lugar más inusual donde os gustaría estar juntos íntimamente 🗺️', en: 'Describe the most unusual place you would like to be intimate together 🗺️' }, level: 'medio', emoji: '🗺️' },
    // INTENSO
    { text: { es: 'Explorad una zona erógena que normalmente ignoráis durante 3 minutos ⚡', en: 'Explore an erogenous zone you normally ignore for 3 minutes ⚡' }, level: 'intenso', emoji: '⚡' },
    { text: { es: 'Realizad un striptease completo el uno para el otro 🌶️', en: 'Perform a full striptease for each other 🌶️' }, level: 'intenso', emoji: '🌶️' },
    { text: { es: 'Usad un cubito de hielo en zonas del cuerpo del otro durante 2 min 🧊', en: 'Use an ice cube on each other\'s body for 2 minutes 🧊' }, level: 'intenso', emoji: '🧊' },
    { text: { es: 'Confesad vuestro mayor fetiche sexual al otro 🤫', en: 'Confess your biggest sexual fetish to each other 🤫' }, level: 'intenso', emoji: '🤫' },
    { text: { es: 'Haced un rol de jefe y secretaria/o durante 5 minutos 💼', en: 'Do a boss and secretary roleplay for 5 minutes 💼' }, level: 'intenso', emoji: '💼' },
    { text: { es: 'Besaos con intensidad durante 2 minutos sin parar 💋🔥', en: 'Kiss intensely for 2 minutes without stopping 💋🔥' }, level: 'intenso', emoji: '💋' },
    { text: { es: 'Describid en voz alta qué os gustaría que el otro os hiciese ahora mismo 😈', en: 'Describe out loud what you would like the other to do to you right now 😈' }, level: 'intenso', emoji: '😈' },
    { text: { es: 'Practicad el juego del silencio: ninguno puede hacer ruido durante 3 minutos 🤫', en: 'Play the silence game: neither can make a sound for 3 minutes 🤫' }, level: 'intenso', emoji: '🤫' },
    { text: { es: 'Elegid una fantasía de vuestros sueños y planificadla para esta semana 📅', en: 'Choose a fantasy from your dreams and plan it for this week 📅' }, level: 'intenso', emoji: '📅' },
    { text: { es: 'Atad suavemente las muñecas de la pareja y decidid qué hacer 🔗', en: 'Softly tie each other\'s wrists and decide what to do 🔗' }, level: 'intenso', emoji: '🔗' },
    // EXTREMO
    { text: { es: 'Cread una lista conjunta de cosas que queréis probar en la cama 🔥📝', en: 'Create a joint list of things you want to try in bed 🔥📝' }, level: 'extremo', emoji: '📝' },
    { text: { es: 'Turno de fantasías extremas: revelad vuestro deseo más atrevido sin filtros 💥', en: 'Extreme fantasy turn: reveal your boldest desire without filters 💥' }, level: 'extremo', emoji: '💥' },
    { text: { es: 'Roleplay libre durante 10 minutos: vosotros ponéis las reglas 🎭', en: 'Free roleplay for 10 minutes: you set the rules 🎭' }, level: 'extremo', emoji: '🎭' },
    { text: { es: 'Usad un objeto sorpresa del entorno y explorad vuestros límites 🌡️', en: 'Use a surprise object from your surroundings and explore your limits 🌡️' }, level: 'extremo', emoji: '🌡️' },
    { text: { es: 'Grabad un audio sensual el uno para el otro y escuchadlo juntos 🎙️', en: 'Record a sensual audio message for each other and listen together 🎙️' }, level: 'extremo', emoji: '🎙️' },
    { text: { es: 'Escoged un fetiche de la lista y exploradlo juntos esta noche 🔥', en: 'Pick a fetish from your list and explore it together tonight 🔥' }, level: 'extremo', emoji: '🔥' },
    { text: { es: 'Fantasía del exhibicionismo seguro: escoged una ventana o espacio privado 😈', en: 'Safe exhibitionism fantasy: choose a window or private space 😈' }, level: 'extremo', emoji: '😈' },
  ];

  levelColors: Record<string, string> = {
    suave: '#3be8b0',
    medio: '#f7c948',
    intenso: '#ff6b35',
    extremo: '#d62246'
  };

  levelLabels: Record<string, { es: string; en: string }> = {
    suave:  { es: '💚 Suave',  en: '💚 Soft'    },
    medio:  { es: '💛 Medio',  en: '💛 Medium'  },
    intenso:{ es: '🧡 Intenso',en: '🧡 Intense' },
    extremo:{ es: '❤️ Extremo',en: '❤️ Extreme' }
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

  get levelList() {
    return ['suave', 'medio', 'intenso', 'extremo'];
  }

  toggleLevel(level: string) {
    if (this.selectedLevels.has(level)) {
      if (this.selectedLevels.size > 1) this.selectedLevels.delete(level);
    } else {
      this.selectedLevels.add(level);
    }
  }

  startGame() {
    this.usedIndices = [];
    this.currentPhase = 'playing';
    this.drawCard();
  }

  get filteredFantasies(): Fantasy[] {
    return this.allFantasies.filter(f => this.selectedLevels.has(f.level));
  }

  drawCard(): void {
    if (this.animating) return;
    const available = this.filteredFantasies
      .map((f, i) => i)
      .filter(i => !this.usedIndices.includes(i));

    if (available.length === 0) {
      this.usedIndices = [];
      return this.drawCard();
    }

    const pick = available[Math.floor(Math.random() * available.length)];
    this.usedIndices.push(pick);

    this.animating = true;
    this.flipped = false;

    setTimeout(() => {
      this.currentFantasy = this.filteredFantasies[pick];
      this.flipped = true;
      this.animating = false;
    }, 400);
  }

  backToSetup() {
    this.currentPhase = 'setup';
    this.currentFantasy = null;
    this.flipped = false;
    this.usedIndices = [];
  }

  levelLabel(level: string): string {
    return this.levelLabels[level]?.[this.lang] ?? level;
  }

  levelColor(level: string): string {
    return this.levelColors[level] ?? '#fff';
  }
}
