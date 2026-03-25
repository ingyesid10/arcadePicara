import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface ConfesaCard {
  text: { es: string; en: string };
  type: 'confesion' | 'posicion' | 'lugar' | 'parte';
  level: 'picante' | 'hot' | 'extremo';
  emoji: string;
}

@Component({
  selector: 'app-confiesa-todo',
  templateUrl: './confiesa-todo.component.html',
  styleUrls: ['./confiesa-todo.component.css']
})
export class ConfiesaTodoComponent implements OnInit, OnDestroy {

  currentPhase: 'setup' | 'playing' = 'setup';
  selectedTypes: Set<string> = new Set(['confesion', 'posicion', 'lugar', 'parte']);
  selectedLevels: Set<string> = new Set(['picante', 'hot']);
  flipped = false;
  animating = false;
  currentCard: ConfesaCard | null = null;
  usedIndices: number[] = [];
  cardsFlipped = 0;
  showInstructions = false;
  private langSub?: Subscription;

  allCards: ConfesaCard[] = [
    // ── CONFESIONES – PICANTE ─────────────────────────────────────────────
    { text: { es: '¿Alguna vez has enviado un audio o video íntimo a alguien? Confiésalo al grupo 📱', en: 'Have you ever sent an intimate audio or video to someone? Confess it to the group 📱' }, type: 'confesion', level: 'picante', emoji: '🤫' },
    { text: { es: '¿Cuántas personas de esta sala has imaginado en una situación íntima? Solo di el número 🙈', en: 'How many people in this room have you imagined in an intimate situation? Just say the number 🙈' }, type: 'confesion', level: 'picante', emoji: '🙈' },
    { text: { es: '¿Has tenido sexo en casa de tus padres o suegros? Sé honesto/a 🏠', en: 'Have you had sex at your parents or in-laws house? Be honest 🏠' }, type: 'confesion', level: 'picante', emoji: '🏠' },

    // ── CONFESIONES – HOT ─────────────────────────────────────────────────
    { text: { es: '¿Has estado con alguien y no recordabas su nombre al día siguiente? Confiesa 😈', en: 'Have you been with someone and couldn\'t remember their name the next day? Confess 😈' }, type: 'confesion', level: 'hot', emoji: '😈' },
    { text: { es: '¿Cuántas personas con las que has estado sigues teniendo en el teléfono? Solo el número 📞', en: 'How many people you\'ve slept with are still in your phone? Just the number 📞' }, type: 'confesion', level: 'hot', emoji: '📞' },
    { text: { es: '¿Has fingido alguna vez para terminar antes? Sé completamente honesto/a 😅', en: 'Have you ever faked it just to end sooner? Be completely honest 😅' }, type: 'confesion', level: 'hot', emoji: '😅' },
    { text: { es: '¿Alguna vez has estado con dos personas distintas en la misma semana? Di sí o no y cómo fue 🔥', en: 'Have you ever been with two different people in the same week? Say yes or no and explain 🔥' }, type: 'confesion', level: 'hot', emoji: '🔥' },

    // ── CONFESIONES – EXTREMO ─────────────────────────────────────────────
    { text: { es: '¿Cuál es la cosa más atrevida que has hecho en la cama y nunca le has contado a nadie? 🤐', en: 'What is the most daring thing you\'ve done in bed that you\'ve never told anyone? 🤐' }, type: 'confesion', level: 'extremo', emoji: '🤐' },
    { text: { es: '¿Cuál es el fetiche que más te avergüenza admitir pero que disfrutas? Confiésalo hoy 🔮', en: 'What fetish are you most embarrassed to admit you enjoy? Confess it today 🔮' }, type: 'confesion', level: 'extremo', emoji: '🔮' },
    { text: { es: '¿Has tenido una fantasía con alguien que no deberías (pareja de amigo/a, familiar de ex...)? Solo di sí o no y quién era (sin nombre) 👀', en: 'Have you had a fantasy about someone you shouldn\'t have (a friend\'s partner, ex\'s relative...)? Just say yes or no and describe who (no names) 👀' }, type: 'confesion', level: 'extremo', emoji: '👀' },

    // ── POSICIONES – PICANTE ──────────────────────────────────────────────
    { text: { es: '¿Cuál es tu posición favorita de todos los tiempos? Explica por qué te gusta tanto 💪', en: 'What is your all-time favorite position? Explain why you like it so much 💪' }, type: 'posicion', level: 'picante', emoji: '💪' },
    { text: { es: '¿Prefieres ser activo/a o pasivo/a? ¿Por qué? 🔄', en: 'Do you prefer to be on top or bottom? Why? 🔄' }, type: 'posicion', level: 'picante', emoji: '🔄' },
    { text: { es: '¿Cuál es la posición que más rápido te lleva al clímax? Sin rodeos 🎯', en: 'Which position brings you to the finish the fastest? No beating around the bush 🎯' }, type: 'posicion', level: 'picante', emoji: '🎯' },

    // ── POSICIONES – HOT ──────────────────────────────────────────────────
    { text: { es: 'Describe la posición más acrobática o rara que hayas intentado. ¿Salió bien? 🤸', en: 'Describe the most acrobatic or unusual position you\'ve tried. Did it work out? 🤸' }, type: 'posicion', level: 'hot', emoji: '🤸' },
    { text: { es: '¿Hay alguna posición que intentaste y te sorprendió lo increíble que fue? Descríbela 😍', en: 'Is there a position you tried that surprised you with how incredible it was? Describe it 😍' }, type: 'posicion', level: 'hot', emoji: '😍' },
    { text: { es: '¿Cuál es la posición en la que más placer has dado a tu pareja? ¿Por qué crees que funciona? ❤️', en: 'Which position have you given the most pleasure to your partner in? Why do you think it works? ❤️' }, type: 'posicion', level: 'hot', emoji: '❤️' },
    { text: { es: 'Di una posición que quieras intentar y con quién del grupo lo harías si pudieras 🌶️', en: 'Name a position you want to try and who in the group you would do it with if you could 🌶️' }, type: 'posicion', level: 'hot', emoji: '🌶️' },

    // ── POSICIONES – EXTREMO ──────────────────────────────────────────────
    { text: { es: 'Describe con el mayor detalle posible la sesión con más posiciones distintas que hayas tenido 🔥', en: 'Describe in as much detail as possible the session with the most different positions you\'ve had 🔥' }, type: 'posicion', level: 'extremo', emoji: '🔥' },
    { text: { es: '¿Cuál es la posición en la que más ruido involuntario haces? Demuéstralo solo 5 segundos 😂', en: 'Which position makes you the noisiest? Demonstrate it for just 5 seconds 😂' }, type: 'posicion', level: 'extremo', emoji: '😂' },
    { text: { es: 'Si pudieras elegir una posición para esta noche con alguien del grupo, ¿cuál sería y con quién? 🔥', en: 'If you could choose a position for tonight with someone here, which and who? 🔥' }, type: 'posicion', level: 'extremo', emoji: '🔥' },

    // ── LUGARES – PICANTE ─────────────────────────────────────────────────
    { text: { es: '¿Cuál es el lugar más curioso fuera de una cama donde has tenido sexo? 🗺️', en: 'What is the most unusual place outside a bed where you\'ve had sex? 🗺️' }, type: 'lugar', level: 'picante', emoji: '🗺️' },
    { text: { es: '¿Has tenido sexo en el coche? ¿Dónde estaba aparcado y era de día o de noche? 🚗', en: 'Have you had sex in a car? Where was it parked and was it day or night? 🚗' }, type: 'lugar', level: 'picante', emoji: '🚗' },
    { text: { es: '¿Has tenido un momento íntimo en el trabajo, escuela o universidad? ¿Era horario laboral? 💼', en: 'Have you had an intimate moment at work, school or university? Was it during working hours? 💼' }, type: 'lugar', level: 'picante', emoji: '💼' },

    // ── LUGARES – HOT ─────────────────────────────────────────────────────
    { text: { es: '¿Has tenido sexo al aire libre? ¿Dónde exactamente y quién lo propuso? 🌲', en: 'Have you had sex outdoors? Where exactly and who suggested it? 🌲' }, type: 'lugar', level: 'hot', emoji: '🌲' },
    { text: { es: '¿Has tenido sexo en casa de un amigo/a o familiar? ¿En qué habitación? 🚪', en: 'Have you had sex at a friend\'s or family member\'s house? Which room? 🚪' }, type: 'lugar', level: 'hot', emoji: '🚪' },
    { text: { es: '¿Has tenido un momento íntimo en un medio de transporte? ¿En cuál? Cuenta todos los detalles 🚂', en: 'Have you had an intimate moment on a form of transportation? Which one? Share all the details 🚂' }, type: 'lugar', level: 'hot', emoji: '🚂' },
    { text: { es: '¿El lugar más excitante donde lo has hecho era un sitio "prohibido" o donde podían veros? 🚫', en: 'Was the most exciting place you\'ve done it somewhere "forbidden" or where you could be seen? 🚫' }, type: 'lugar', level: 'hot', emoji: '🚫' },

    // ── LUGARES – EXTREMO ─────────────────────────────────────────────────
    { text: { es: 'Describe el lugar más salvaje o arriesgado donde lo has hecho, con todos los detalles 😱', en: 'Describe the most wild or risky place where you\'ve done it, with all the details 😱' }, type: 'lugar', level: 'extremo', emoji: '😱' },
    { text: { es: '¿Te han pillado alguna vez in fraganti? ¿Dónde estabas y quién os sorprendió? 👀', en: 'Have you ever been caught in the act? Where were you and who caught you? 👀' }, type: 'lugar', level: 'extremo', emoji: '👀' },
    { text: { es: '¿Cuál es el lugar donde todavía no lo has hecho pero llevas tiempo fantaseando? Compártelo con todos 🔥', en: 'What is the place you haven\'t done it yet but have been fantasizing about for a while? Share it 🔥' }, type: 'lugar', level: 'extremo', emoji: '🔥' },

    // ── PARTES DEL CUERPO – PICANTE ───────────────────────────────────────
    { text: { es: '¿Cuál es la parte del cuerpo femenino que más te vuelve loco/a? Explica por qué 😍', en: 'What part of the female body drives you the craziest? Explain why 😍' }, type: 'parte', level: 'picante', emoji: '😍' },
    { text: { es: 'Hombres: ¿hay una parte del cuerpo de la mujer donde prefieres terminar? ¿Cuál y por qué? 💦', en: 'Men: is there a part of a woman\'s body where you prefer to finish? Which one and why? 💦' }, type: 'parte', level: 'picante', emoji: '💦' },
    { text: { es: '¿Cuál es la parte del cuerpo de tu pareja que más disfrutas durante el sexo? Menciónala 🔥', en: 'What part of your partner\'s body do you enjoy the most during sex? Name it 🔥' }, type: 'parte', level: 'picante', emoji: '🔥' },

    // ── PARTES DEL CUERPO – HOT ───────────────────────────────────────────
    { text: { es: 'Hombres: nombra todas las partes del cuerpo femenino donde has terminado en tu vida. El grupo cuenta 💦', en: 'Men: name all the parts of a woman\'s body where you have finished in your life. Group keeps count 💦' }, type: 'parte', level: 'hot', emoji: '💦' },
    { text: { es: '¿Cuál es la parte del cuerpo más inesperada donde has puesto tu boca durante el sexo? 😋', en: 'What is the most unexpected body part where you\'ve put your mouth during sex? 😋' }, type: 'parte', level: 'hot', emoji: '😋' },
    { text: { es: 'Mujeres: ¿en qué parte de vuestro cuerpo os gusta más que el hombre termine? ¿Por qué? 💋', en: 'Women: what part of your body do you most enjoy the man finishing on? Why? 💋' }, type: 'parte', level: 'hot', emoji: '💋' },
    { text: { es: '¿Cuál es la parte del cuerpo femenino más erótica y subestimada que poca gente menciona? Da tu opinión 🌹', en: 'What is the most erotic and underrated part of the female body that few people mention? Give your opinion 🌹' }, type: 'parte', level: 'hot', emoji: '🌹' },

    // ── PARTES DEL CUERPO – EXTREMO ───────────────────────────────────────
    { text: { es: 'Hombres: describe el momento más memorable en que terminaste en una parte específica del cuerpo de tu pareja — todos los detalles 💥', en: 'Men: describe the most memorable moment you finished on a specific part of your partner\'s body — all the details 💥' }, type: 'parte', level: 'extremo', emoji: '💥' },
    { text: { es: '¿Alguna vez pediste o te pidieron terminar en una parte específica? ¿Cuál fue y cómo resultó? 🔥', en: 'Have you ever asked or been asked to finish on a specific body part? Which was it and how did it go? 🔥' }, type: 'parte', level: 'extremo', emoji: '🔥' },
    { text: { es: 'Elige a alguien del grupo y dile en voz alta en qué parte de su cuerpo querrías terminar o que terminaran en ti 🎯', en: 'Choose someone in the group and tell them out loud which part of their body you\'d want to finish on or have them finish on you 🎯' }, type: 'parte', level: 'extremo', emoji: '🎯' },
  ];

  typeColors: Record<string, string> = {
    confesion: '#a855f7',
    posicion:  '#ef4444',
    lugar:     '#f59e0b',
    parte:     '#ec4899'
  };

  levelColors: Record<string, string> = {
    picante: '#f7c948',
    hot:     '#ff6b35',
    extremo: '#d62246'
  };

  typeLabels: Record<string, { es: string; en: string }> = {
    confesion: { es: '🤫 Confesión',  en: '🤫 Confession'  },
    posicion:  { es: '💪 Posición',   en: '💪 Position'    },
    lugar:     { es: '🗺️ Lugar',      en: '🗺️ Place'       },
    parte:     { es: '💦 Partes',     en: '💦 Body Parts'  }
  };

  levelLabels: Record<string, { es: string; en: string }> = {
    picante: { es: '🌶️ Picante', en: '🌶️ Spicy'   },
    hot:     { es: '🔥 Hot',     en: '🔥 Hot'      },
    extremo: { es: '💥 Extremo', en: '💥 Extreme'  }
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

  get typeList() { return ['confesion', 'posicion', 'lugar', 'parte']; }
  get levelList() { return ['picante', 'hot', 'extremo']; }

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

  get filteredCards(): ConfesaCard[] {
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

  typeLabel(t: string): string { return this.typeLabels[t]?.[this.lang] ?? t; }
  typeColor(t: string): string { return this.typeColors[t] ?? '#fff'; }
  levelLabel(l: string): string { return this.levelLabels[l]?.[this.lang] ?? l; }
  levelColor(l: string): string { return this.levelColors[l] ?? '#fff'; }
}
