import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface NeverCard {
  text: { es: string; en: string };
  level: 'travieso' | 'hot' | 'extremo';
  emoji: string;
  drinkCount: number; // cuántos sorbos por este enunciado
}

@Component({
  selector: 'app-yo-nunca',
  templateUrl: './yo-nunca.component.html',
  styleUrls: ['./yo-nunca.component.css']
})
export class YoNuncaComponent implements OnInit, OnDestroy {

  currentPhase: 'setup' | 'playing' = 'setup';
  selectedLevels: string[] = ['travieso', 'hot'];
  showInstructions = false;
  flipped = false;
  animating = false;
  currentCard: NeverCard | null = null;
  usedIndices: number[] = [];
  cardsFlipped = 0;
  totalDrinks = 0;

  private langSub?: Subscription;

  levelColors: Record<string, string> = {
    travieso: '#4fc3f7',
    hot:      '#ff6b35',
    extremo:  '#d62246'
  };

  levelLabels: Record<string, { es: string; en: string }> = {
    travieso: { es: '💙 Travieso', en: '💙 Naughty'  },
    hot:      { es: '🧡 Hot',      en: '🧡 Hot'      },
    extremo:  { es: '❤️ Extremo',  en: '❤️ Extreme'  }
  };

  allCards: NeverCard[] = [
    // ── TRAVIESO ─────────────────────────────────────────────────────────
    { text: { es: 'Yo nunca he ligado con alguien en una boda 💒', en: 'I have never hooked up with someone at a wedding 💒' }, level: 'travieso', emoji: '💒', drinkCount: 1 },
    { text: { es: 'Yo nunca he besado a alguien del mismo género 👄', en: 'I have never kissed someone of the same gender 👄' }, level: 'travieso', emoji: '👄', drinkCount: 1 },
    { text: { es: 'Yo nunca he mandado o recibido un mensaje hot 📱', en: 'I have never sent or received a spicy message 📱' }, level: 'travieso', emoji: '📱', drinkCount: 1 },
    { text: { es: 'Yo nunca he dormido en casa de alguien que acabo de conocer 🛏️', en: 'I have never slept at someone\'s place that I just met 🛏️' }, level: 'travieso', emoji: '🛏️', drinkCount: 1 },
    { text: { es: 'Yo nunca le he dicho "te quiero" solo para no herir sentimientos 💔', en: 'I have never said "I love you" just to avoid hurting someone\'s feelings 💔' }, level: 'travieso', emoji: '💔', drinkCount: 1 },
    { text: { es: 'Yo nunca he fingido estar ocupado/a para evitar a alguien 📵', en: 'I have never pretended to be busy to avoid someone 📵' }, level: 'travieso', emoji: '📵', drinkCount: 1 },
    { text: { es: 'Yo nunca he tenido una cita en la que ninguna de las partes quería estar 😬', en: 'I have never been on a date where neither party wanted to be there 😬' }, level: 'travieso', emoji: '😬', drinkCount: 1 },
    { text: { es: 'Yo nunca he besado a alguien sin saber su nombre 🎭', en: 'I have never kissed someone without knowing their name 🎭' }, level: 'travieso', emoji: '🎭', drinkCount: 1 },
    { text: { es: 'Yo nunca he mirado el móvil de mi pareja sin que lo supiera 🔍', en: 'I have never looked through my partner\'s phone without them knowing 🔍' }, level: 'travieso', emoji: '🔍', drinkCount: 1 },
    { text: { es: 'Yo nunca he tenido una crush en alguien de mucho más edad que yo 🔞', en: 'I have never had a crush on someone much older than me 🔞' }, level: 'travieso', emoji: '🔞', drinkCount: 1 },
    { text: { es: 'Yo nunca he roto con alguien por mensaje o nota 📝', en: 'I have never broken up with someone by text or note 📝' }, level: 'travieso', emoji: '📝', drinkCount: 1 },
    { text: { es: 'Yo nunca he coqueteado para conseguir algo gratis o descuento 😏', en: 'I have never flirted to get something for free or a discount 😏' }, level: 'travieso', emoji: '😏', drinkCount: 1 },

    // ── HOT ──────────────────────────────────────────────────────────────
    { text: { es: 'Yo nunca he tenido sexo en casa de mis padres 🏡', en: 'I have never had sex at my parents\' house 🏡' }, level: 'hot', emoji: '🏡', drinkCount: 2 },
    { text: { es: 'Yo nunca he hecho sexting con alguien que no debería 📲', en: 'I have never sexted someone I shouldn\'t have 📲' }, level: 'hot', emoji: '📲', drinkCount: 2 },
    { text: { es: 'Yo nunca he tenido fantasías con alguien de este grupo 🙈', en: 'I have never had fantasies about someone in this group 🙈' }, level: 'hot', emoji: '🙈', drinkCount: 2 },
    { text: { es: 'Yo nunca he visto contenido para adultos con otra persona presente 🎬', en: 'I have never watched adult content with another person present 🎬' }, level: 'hot', emoji: '🎬', drinkCount: 2 },
    { text: { es: 'Yo nunca he tenido sexo al aire libre 🌳', en: 'I have never had sex outdoors 🌳' }, level: 'hot', emoji: '🌳', drinkCount: 2 },
    { text: { es: 'Yo nunca me he despertado sin recordar exactamente lo que pasé con alguien la noche anterior 😅', en: 'I have never woken up not fully remembering what happened with someone the night before 😅' }, level: 'hot', emoji: '😅', drinkCount: 2 },
    { text: { es: 'Yo nunca he usado un juguete íntimo 💜', en: 'I have never used an intimate toy 💜' }, level: 'hot', emoji: '💜', drinkCount: 2 },
    { text: { es: 'Yo nunca le he enviado una foto íntima a alguien 📸', en: 'I have never sent an intimate photo to someone 📸' }, level: 'hot', emoji: '📸', drinkCount: 2 },
    { text: { es: 'Yo nunca he tenido sexo con alguien que estaba en una relación al momento 😈', en: 'I have never had sex with someone who was in a relationship at the time 😈' }, level: 'hot', emoji: '😈', drinkCount: 2 },
    { text: { es: 'Yo nunca he dado o recibido un masaje que terminó en algo más 🤝', en: 'I have never given or received a massage that turned into something more 🤝' }, level: 'hot', emoji: '🤝', drinkCount: 2 },
    { text: { es: 'Yo nunca he tenido una relación de una sola noche 🌙', en: 'I have never had a one-night stand 🌙' }, level: 'hot', emoji: '🌙', drinkCount: 2 },
    { text: { es: 'Yo nunca he besado a alguien delante de su pareja 🤭', en: 'I have never kissed someone in front of their partner 🤭' }, level: 'hot', emoji: '🤭', drinkCount: 2 },

    // ── EXTREMO ───────────────────────────────────────────────────────────
    { text: { es: 'Yo nunca he grabado un vídeo íntimo 🎥', en: 'I have never recorded an intimate video 🎥' }, level: 'extremo', emoji: '🎥', drinkCount: 3 },
    { text: { es: 'Yo nunca he estado con dos personas distintas en la misma semana 🔥', en: 'I have never been with two different people in the same week 🔥' }, level: 'extremo', emoji: '🔥', drinkCount: 3 },
    { text: { es: 'Yo nunca he explorado el rol de dominación o sumisión 🔗', en: 'I have never explored a dominance or submission role 🔗' }, level: 'extremo', emoji: '🔗', drinkCount: 3 },
    { text: { es: 'Yo nunca he tenido una experiencia con más de una persona al mismo tiempo 💥', en: 'I have never had an experience with more than one person at the same time 💥' }, level: 'extremo', emoji: '💥', drinkCount: 3 },
    { text: { es: 'Yo nunca he hecho un striptease completo para alguien 💃', en: 'I have never done a full striptease for someone 💃' }, level: 'extremo', emoji: '💃', drinkCount: 3 },
    { text: { es: 'Yo nunca he tenido sexo en un lugar donde podían pillarnos en cualquier momento 🚨', en: 'I have never had sex somewhere we could have been caught at any moment 🚨' }, level: 'extremo', emoji: '🚨', drinkCount: 3 },
    { text: { es: 'Yo nunca he cumplido una fantasía sexual que me parecía imposible de hacer realidad 🌶️', en: 'I have never fulfilled a sexual fantasy I thought I\'d never actually do 🌶️' }, level: 'extremo', emoji: '🌶️', drinkCount: 3 },
    { text: { es: 'Yo nunca le he pedido a alguien que me grabe o los he grabado yo sin que lo supieran 😱', en: 'I have never asked someone to record me or recorded them without their knowledge 😱' }, level: 'extremo', emoji: '😱', drinkCount: 3 },
    { text: { es: 'Yo nunca he actuado un roleplay sexual disfrazado o con personaje 🎭', en: 'I have never acted out a sexual roleplay in costume or as a character 🎭' }, level: 'extremo', emoji: '🎭', drinkCount: 3 },
    { text: { es: 'Yo nunca he tenido sexo con alguien mucho más joven o mayor que yo (más de 10 años de diferencia) 🔞', en: 'I have never had sex with someone much younger or older than me (more than 10 years apart) 🔞' }, level: 'extremo', emoji: '🔞', drinkCount: 3 },
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

  get levelList() { return ['travieso', 'hot', 'extremo']; }

  toggleLevel(l: string) {
    if (this.selectedLevels.includes(l)) {
      if (this.selectedLevels.length > 1) this.selectedLevels = this.selectedLevels.filter(x => x !== l);
    } else {
      this.selectedLevels = [...this.selectedLevels, l];
    }
  }

  get filteredCards(): NeverCard[] {
    return this.allCards.filter(c => this.selectedLevels.includes(c.level));
  }

  startGame() {
    this.usedIndices = [];
    this.cardsFlipped = 0;
    this.totalDrinks = 0;
    this.currentPhase = 'playing';
    this.nextCard();
  }

  flipCard(): void {
    if (!this.flipped && !this.animating) {
      this.flipped = true;
    }
  }

  nextCard(): void {
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
      this.cardsFlipped++;
      this.animating = false;
    }, 400);
  }

  addDrinks(n: number) {
    this.totalDrinks += n;
  }

  backToSetup() {
    this.currentPhase = 'setup';
    this.currentCard = null;
    this.flipped = false;
    this.usedIndices = [];
    this.cardsFlipped = 0;
    this.totalDrinks = 0;
    this.selectedLevels = ['travieso', 'hot'];
  }

  levelLabel(l: string): string { return this.levelLabels[l]?.[this.lang] ?? l; }
  levelColor(l: string): string { return this.levelColors[l] ?? '#fff'; }
  getLevelColor(l: string): string { return this.levelColors[l] ?? '#fff'; }
}
