import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface WYRQuestion {
  optionA: { es: string; en: string };
  optionB: { es: string; en: string };
  level: 'romantico' | 'travieso' | 'hot' | 'extremo';
  emoji: string;
}

@Component({
  selector: 'app-would-you-rather',
  templateUrl: './would-you-rather.component.html',
  styleUrls: ['./would-you-rather.component.css']
})
export class WouldYouRatherComponent implements OnInit, OnDestroy {

  currentPhase: 'setup' | 'playing' = 'setup';
  selectedLevels: Set<string> = new Set(['romantico', 'travieso']);
  flipped = false;
  animating = false;
  currentQuestion: WYRQuestion | null = null;
  usedIndices: number[] = [];
  private langSub?: Subscription;

  allQuestions: WYRQuestion[] = [
    // ROMÁNTICO
    { optionA: { es: 'Dormir abrazados toda la noche 🤗', en: 'Sleep hugging all night 🤗' }, optionB: { es: 'Quedarse despiertos hablando hasta el amanecer 🌅', en: 'Stay up talking until sunrise 🌅' }, level: 'romantico', emoji: '💑' },
    { optionA: { es: 'Cena romántica hecha en casa 🕯️', en: 'Romantic homemade dinner 🕯️' }, optionB: { es: 'Escapada sorpresa a un hotel 🏨', en: 'Surprise getaway to a hotel 🏨' }, level: 'romantico', emoji: '🍷' },
    { optionA: { es: 'Recibir un masaje de 30 minutos 💆', en: 'Get a 30-minute massage 💆' }, optionB: { es: 'Baño de burbujas juntos con velas 🛁', en: 'Bubble bath together with candles 🛁' }, level: 'romantico', emoji: '✨' },
    { optionA: { es: 'Carta de amor escrita a mano 💌', en: 'Handwritten love letter 💌' }, optionB: { es: 'Playlist hecha especialmente para vosotros 🎵', en: 'Playlist made just for you two 🎵' }, level: 'romantico', emoji: '💌' },
    { optionA: { es: 'Bailar lento en casa sin música 💃', en: 'Slow dance at home without music 💃' }, optionB: { es: 'Pasear de noche bajo las estrellas 🌟', en: 'Night walk under the stars 🌟' }, level: 'romantico', emoji: '🌙' },
    { optionA: { es: 'Que te despierten con desayuno en cama 🥐', en: 'Wake up to breakfast in bed 🥐' }, optionB: { es: 'Que te despierten con besos por todo el cuerpo 😘', en: 'Wake up to kisses all over your body 😘' }, level: 'romantico', emoji: '☀️' },
    { optionA: { es: 'Una semana de mensajes muy románticos 💬', en: 'A week of super romantic messages 💬' }, optionB: { es: 'Un día entero solo para vosotros dos sin móviles 👫', en: 'A full day just for the two of you, no phones 👫' }, level: 'romantico', emoji: '📱' },
    { optionA: { es: 'Ver una película abrazados 🎬', en: 'Watch a movie hugged together 🎬' }, optionB: { es: 'Contar recuerdos de vuestra historia juntos 📖', en: 'Share memories of your story together 📖' }, level: 'romantico', emoji: '🎞️' },
    // TRAVIESO
    { optionA: { es: 'Striptease lento con música sensual 🎶', en: 'Slow striptease with sensual music 🎶' }, optionB: { es: 'Mensaje de voz muy picante 🎙️', en: 'A very spicy voice message 🎙️' }, level: 'travieso', emoji: '😏' },
    { optionA: { es: 'Despertarle con besos en el cuello 😏', en: 'Wake them up with kisses on the neck 😏' }, optionB: { es: 'Sorprenderle con lencería inesperada 😈', en: 'Surprise them with unexpected lingerie 😈' }, level: 'travieso', emoji: '💋' },
    { optionA: { es: 'Rol: desconocidos en un bar 🍸', en: 'Roleplay: strangers at a bar 🍸' }, optionB: { es: 'Rol: jefe y empleado 💼', en: 'Roleplay: boss and employee 💼' }, level: 'travieso', emoji: '🎭' },
    { optionA: { es: 'Ducharse juntos con espuma 🚿', en: 'Shower together with foam 🚿' }, optionB: { es: 'Bañarse lento con velas y música 🛁', en: 'Slow bath with candles and music 🛁' }, level: 'travieso', emoji: '🫧' },
    { optionA: { es: 'Vendarse los ojos 🙈', en: 'Wear a blindfold 🙈' }, optionB: { es: 'Atarse suavemente las manos 🔗', en: 'Softly tie each other\'s hands 🔗' }, level: 'travieso', emoji: '🔒' },
    { optionA: { es: 'Hacerlo en silencio total 🤫', en: 'Do it in total silence 🤫' }, optionB: { es: 'Decirse todo lo que se piensa en voz alta 🗣️', en: 'Say everything on your mind out loud 🗣️' }, level: 'travieso', emoji: '🤐' },
    { optionA: { es: 'Masaje con aceite caliente de 20 minutos 💆', en: '20-minute warm oil massage 💆' }, optionB: { es: '20 minutos de besos sin parar 💋', en: '20 minutes of non-stop kissing 💋' }, level: 'travieso', emoji: '⏱️' },
    { optionA: { es: 'Que la pareja decida todo esa noche 👑', en: 'Let your partner decide everything tonight 👑' }, optionB: { es: 'Turnarse pidiendo lo que cada uno quiere 🔄', en: 'Take turns asking for what you each want 🔄' }, level: 'travieso', emoji: '🎯' },
    { optionA: { es: 'Hacerlo rápido y apasionado ⚡', en: 'Do it fast and passionate ⚡' }, optionB: { es: 'Tomarse toda la noche muy lentamente 🌙', en: 'Take the whole night very slowly 🌙' }, level: 'travieso', emoji: '🔥' },
    { optionA: { es: 'Escribirle en el cuerpo con el dedo lo que quieres ✍️', en: 'Write on their body with your finger what you want ✍️' }, optionB: { es: 'Susurrarle al oído todo lo que quieres hacer 👂', en: 'Whisper in their ear everything you want to do 👂' }, level: 'travieso', emoji: '💭' },
    // HOT
    { optionA: { es: 'Cubitos de hielo por el cuerpo 🧊', en: 'Ice cubes on your body 🧊' }, optionB: { es: 'Gotitas de cera de vela a temperatura segura 🕯️', en: 'Candle wax drops at safe temperature 🕯️' }, level: 'hot', emoji: '⚡' },
    { optionA: { es: 'Luz tenue y cálida 🕯️', en: 'Dim warm lighting 🕯️' }, optionB: { es: 'Totalmente a oscuras 🌑', en: 'Completely in the dark 🌑' }, level: 'hot', emoji: '💡' },
    { optionA: { es: 'Frente a un espejo 🪞', en: 'In front of a mirror 🪞' }, optionB: { es: 'Sin veros, solo al tacto 👐', en: 'Without seeing each other, just by touch 👐' }, level: 'hot', emoji: '👁️' },
    { optionA: { es: 'Con música intensa de fondo 🎵', en: 'With intense music in the background 🎵' }, optionB: { es: 'En silencio absoluto, solo vuestros sonidos 🔇', en: 'In absolute silence, only your sounds 🔇' }, level: 'hot', emoji: '🎶' },
    { optionA: { es: 'Lencería especial desde el principio 👙', en: 'Special lingerie from the start 👙' }, optionB: { es: 'Desnudo/a total desde el primer segundo 🔥', en: 'Completely naked from the first second 🔥' }, level: 'hot', emoji: '🌶️' },
    { optionA: { es: 'Hacer una lista de 5 cosas a probar 📝', en: 'Make a list of 5 things to try 📝' }, optionB: { es: 'Dejarlo todo al azar esa noche 🎲', en: 'Leave everything to chance that night 🎲' }, level: 'hot', emoji: '📋' },
    { optionA: { es: 'Hacerlo en un lugar diferente de casa 🏨', en: 'Do it somewhere other than home 🏨' }, optionB: { es: 'En casa pero de forma totalmente diferente 🏠', en: 'At home but in a completely different way 🏠' }, level: 'hot', emoji: '📍' },
    { optionA: { es: '10 minutos muy intensos ⏱️', en: '10 very intense minutes ⏱️' }, optionB: { es: '2 horas sin ninguna prisa 🕐', en: '2 hours with no rush 🕐' }, level: 'hot', emoji: '⌛' },
    { optionA: { es: 'Foto Polaroid solo para vosotros 📸', en: 'Polaroid photo just for you two 📸' }, optionB: { es: 'Video privado que borraréis después 🎥', en: 'Private video you will delete afterwards 🎥' }, level: 'hot', emoji: '📷' },
    { optionA: { es: '3 posiciones distintas en una noche 🔄', en: '3 different positions in one night 🔄' }, optionB: { es: 'La favorita durante toda la noche 💫', en: 'Your favorite position all night long 💫' }, level: 'hot', emoji: '✨' },
    // EXTREMO
    { optionA: { es: 'Un juguete nuevo que ninguno conoce 🛒', en: 'A new toy neither of you has tried 🛒' }, optionB: { es: 'Un objeto del entorno que nunca usasteis así 🏠', en: 'A household object you have never used like this 🏠' }, level: 'extremo', emoji: '🆕' },
    { optionA: { es: 'Probar un fetiche nuevo sin filtros 🤫', en: 'Try a new fetish without filters 🤫' }, optionB: { es: 'Perfeccionar al máximo el fetiche que mas os gusta 🏆', en: 'Perfect the fetish you love most to the maximum 🏆' }, level: 'extremo', emoji: '💥' },
    { optionA: { es: 'Noche con un único límite acordado 🔑', en: 'Night with only one agreed limit 🔑' }, optionB: { es: 'Todo se negocia sobre la marcha esa noche 🎯', en: 'Everything is negotiated on the fly that night 🎯' }, level: 'extremo', emoji: '🗝️' },
    { optionA: { es: 'Tú llevas el control total esa noche 👑', en: 'You are in total control tonight 👑' }, optionB: { es: 'Tú te entregas completamente esa noche 🔒', en: 'You surrender completely tonight 🔒' }, level: 'extremo', emoji: '⚖️' },
    { optionA: { es: 'Fantasía semipública pero segura 😱', en: 'Semi-public but safe fantasy 😱' }, optionB: { es: 'Lugar privado muy inusual 🗝️', en: 'Very unusual private location 🗝️' }, level: 'extremo', emoji: '🗺️' },
    { optionA: { es: 'Rol durante 1h con personajes que no sois vosotros 🎭', en: '1h roleplay as characters that are not you 🎭' }, optionB: { es: 'Fantasía real que nunca os atrevisteis a hacer 💥', en: 'A real fantasy you never dared to act on 💥' }, level: 'extremo', emoji: '🎬' },
    { optionA: { es: 'Grabar solo el audio de esa noche 🎙️', en: 'Record only the audio of that night 🎙️' }, optionB: { es: 'Grabar solo video sin mostrar caras 🎥', en: 'Record video only without showing faces 🎥' }, level: 'extremo', emoji: '📹' },
    { optionA: { es: 'Lista de deseos para cumplir en 1 mes 📅', en: 'Wish list to fulfill in 1 month 📅' }, optionB: { es: 'Contrato de fantasías solo para esa noche 📜', en: 'Fantasy contract for that night only 📜' }, level: 'extremo', emoji: '📝' },
  ];

  levelColors: Record<string, string> = {
    romantico: '#ff85a1',
    travieso:  '#f7c948',
    hot:       '#ff6b35',
    extremo:   '#d62246'
  };

  levelLabels: Record<string, { es: string; en: string }> = {
    romantico: { es: '💗 Romántico', en: '💗 Romantic'  },
    travieso:  { es: '💛 Travieso',  en: '💛 Naughty'   },
    hot:       { es: '🧡 Hot',       en: '🧡 Hot'        },
    extremo:   { es: '❤️ Extremo',   en: '❤️ Extreme'   }
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
    return ['romantico', 'travieso', 'hot', 'extremo'];
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

  get filteredQuestions(): WYRQuestion[] {
    return this.allQuestions.filter(q => this.selectedLevels.has(q.level));
  }

  drawCard(): void {
    if (this.animating) return;
    let available = this.filteredQuestions
      .map((_, i) => i)
      .filter(i => !this.usedIndices.includes(i));

    if (available.length === 0) {
      this.usedIndices = [];
      available = this.filteredQuestions.map((_, i) => i);
    }

    const pick = available[Math.floor(Math.random() * available.length)];
    this.usedIndices.push(pick);

    this.animating = true;
    this.flipped = false;

    setTimeout(() => {
      this.currentQuestion = this.filteredQuestions[pick];
      this.flipped = true;
      this.animating = false;
    }, 400);
  }

  backToSetup() {
    this.currentPhase = 'setup';
    this.currentQuestion = null;
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
