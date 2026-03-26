import { Component, OnInit } from '@angular/core';

interface ChallengeCard {
  text: { es: string; en: string };
  type: 'fisico' | 'erotico' | 'mixto';
}

@Component({
  selector: 'app-hot-physical-challenge',
  templateUrl: './hot-physical-challenge.component.html',
  styleUrls: ['./hot-physical-challenge.component.css']
})
export class HotPhysicalChallengeComponent implements OnInit {

  predefinedCards: ChallengeCard[] = [
    // ─── FISICOS ───
    { text: { es: 'Haz 10 sentadillas mientras tu pareja te besa el cuello.', en: 'Do 10 squats while your partner kisses your neck.' }, type: 'fisico' },
    { text: { es: 'Mantén contacto visual con alguien durante 1 minuto sin reírte. Si fallas, bebe.', en: 'Hold eye contact with someone for 1 minute without laughing. If you fail, drink.' }, type: 'fisico' },
    { text: { es: 'Haz una plancha de 30 segundos mientras alguien te acaricia la espalda.', en: 'Hold a 30-second plank while someone caresses your back.' }, type: 'fisico' },
    { text: { es: 'Haz flexiones mientras tu pareja se sienta sobre tu espalda.', en: 'Do push-ups while your partner sits on your back.' }, type: 'fisico' },
    { text: { es: 'Carga en brazos a alguien del grupo durante 15 segundos.', en: 'Carry someone from the group in your arms for 15 seconds.' }, type: 'fisico' },
    { text: { es: 'Haz una carrera de relevos llevando a tu pareja a cuestas.', en: 'Do a relay race carrying your partner piggyback.' }, type: 'fisico' },
    { text: { es: 'Ponte de pie y haz 20 saltos de tijera lo más rápido posible.', en: 'Stand up and do 20 jumping jacks as fast as you can.' }, type: 'fisico' },
    { text: { es: 'Haz un pulso con la persona de tu izquierda. El perdedor bebe.', en: 'Arm wrestle the person to your left. The loser drinks.' }, type: 'fisico' },
    { text: { es: 'Siéntate en las piernas de alguien durante las próximas 2 rondas.', en: 'Sit on someone\'s lap for the next 2 rounds.' }, type: 'fisico' },
    { text: { es: 'Haz 15 abdominales mientras alguien te sostiene los pies.', en: 'Do 15 sit-ups while someone holds your feet.' }, type: 'fisico' },
    { text: { es: 'Dale la vuelta al grupo caminando como cangrejo.', en: 'Go around the group crab-walking (backwards on hands and feet).' }, type: 'fisico' },
    { text: { es: 'Haz una pelea de pulgares con la persona de tu derecha. El perdedor cumple el siguiente reto doble.', en: 'Thumb war with the person to your right. The loser does the next challenge doubled.' }, type: 'fisico' },
    { text: { es: 'Equilibra un vaso en tu cabeza durante 30 segundos sin que se caiga.', en: 'Balance a cup on your head for 30 seconds without dropping it.' }, type: 'fisico' },

    // ─── EROTICOS ───
    { text: { es: 'Haz un baile erótico de 30 segundos para el grupo o tu pareja.', en: 'Do a 30-second erotic dance for the group or your partner.' }, type: 'erotico' },
    { text: { es: 'Haz un "body shot" (beber de la piel de alguien).', en: 'Do a body shot (drink off someone\'s skin).' }, type: 'erotico' },
    { text: { es: 'Susurra algo provocador al oído de la persona que elijas.', en: 'Whisper something provocative in the ear of the person you choose.' }, type: 'erotico' },
    { text: { es: 'Elige a alguien para que te dé un beso donde el grupo decida (no zonas íntimas).', en: 'Choose someone to give you a kiss wherever the group decides (not intimate areas).' }, type: 'erotico' },
    { text: { es: 'Haz un masaje sensual de 30 segundos en los hombros de la persona a tu derecha.', en: 'Give a 30-second sensual shoulder massage to the person on your right.' }, type: 'erotico' },
    { text: { es: 'Imita tu mejor gemido falso. El grupo vota si es convincente; si no, bebe.', en: 'Do your best fake moan. The group votes if it\'s convincing; if not, drink.' }, type: 'erotico' },
    { text: { es: 'Deja que alguien te ponga hielo en el cuello y déjalo hasta que se derrita.', en: 'Let someone put ice on your neck and leave it until it melts.' }, type: 'erotico' },
    { text: { es: 'Mordisquea suavemente el lóbulo de la oreja de alguien del grupo.', en: 'Gently nibble the earlobe of someone in the group.' }, type: 'erotico' },
    { text: { es: 'Besa la mano de cada persona del grupo de forma seductora.', en: 'Seductively kiss every person\'s hand in the group.' }, type: 'erotico' },
    { text: { es: 'Pasa un cubito de hielo de tu boca a la boca de alguien.', en: 'Pass an ice cube from your mouth to someone else\'s mouth.' }, type: 'erotico' },
    { text: { es: 'Deja que te venden los ojos y adivina quién te está tocando las manos.', en: 'Get blindfolded and guess who is touching your hands.' }, type: 'erotico' },
    { text: { es: 'Haz un striptease quitándote SOLO los zapatos y calcetines de forma seductora.', en: 'Do a striptease taking off ONLY your shoes and socks seductively.' }, type: 'erotico' },
    { text: { es: 'Recorre con un hielo el brazo de alguien del grupo lentamente.', en: 'Slowly run an ice cube along someone\'s arm in the group.' }, type: 'erotico' },
    { text: { es: 'Dale un beso en el cuello a la persona de tu izquierda.', en: 'Give a neck kiss to the person on your left.' }, type: 'erotico' },

    // ─── MIXTOS ───
    { text: { es: 'Deja que el grupo elija una parte de tu cuerpo para recibir un masaje de 1 minuto.', en: 'Let the group choose a part of your body to receive a 1-minute massage.' }, type: 'mixto' },
    { text: { es: 'Simula una posición graciosa/sexy (sin quitarse la ropa) durante 20 segundos.', en: 'Simulate a funny/sexy position (clothed) for 20 seconds.' }, type: 'mixto' },
    { text: { es: 'Si no cumples este reto, quítate una prenda. El grupo elige cuál.', en: 'If you don\'t complete this challenge, remove one piece of clothing. The group chooses which.' }, type: 'mixto' },
    { text: { es: 'Abraza a alguien del grupo durante 30 segundos sin soltarte.', en: 'Hug someone from the group for 30 seconds without letting go.' }, type: 'mixto' },
    { text: { es: 'Deja que alguien te dibuje algo en la espalda con el dedo y adivina qué es.', en: 'Let someone draw something on your back with their finger and guess what it is.' }, type: 'mixto' },
    { text: { es: 'Toma un trago del vaso de la persona más atractiva del grupo (según tú).', en: 'Take a drink from the glass of the person you find most attractive in the group.' }, type: 'mixto' },
    { text: { es: 'Di el nombre de alguien del grupo con voz sexy. Si el grupo se ríe, bebe.', en: 'Say someone\'s name in the group with a sexy voice. If the group laughs, drink.' }, type: 'mixto' },
    { text: { es: 'Haz 10 sentadillas mientras alguien te abraza por detrás.', en: 'Do 10 squats while someone hugs you from behind.' }, type: 'mixto' },
    { text: { es: 'Deja que la persona a tu derecha te despeine y quédate así el resto del juego.', en: 'Let the person on your right mess up your hair and keep it that way for the rest of the game.' }, type: 'mixto' },
    { text: { es: 'Ponte en posición de plancha y deja que alguien se acueste sobre tu espalda 10 segundos.', en: 'Get in a plank position and let someone lie on your back for 10 seconds.' }, type: 'mixto' },
    { text: { es: 'Crea una coreografía de 15 segundos con la persona de tu elección.', en: 'Create a 15-second choreography with the person of your choice.' }, type: 'mixto' },
    { text: { es: 'Deja que alguien te ponga un apodo sexy. Solo responde a ese nombre por 3 rondas.', en: 'Let someone give you a sexy nickname. Only respond to that name for 3 rounds.' }, type: 'mixto' },
    { text: { es: 'Haz un brindis mirando a los ojos de cada persona del grupo.', en: 'Make a toast while looking into each person\'s eyes in the group.' }, type: 'mixto' },
    { text: { es: 'Baila pegado/a con alguien durante 20 segundos. El grupo elige la canción.', en: 'Dance close with someone for 20 seconds. The group picks the song.' }, type: 'mixto' },
    { text: { es: 'Imita la escena más romántica de una película. El grupo adivina cuál es.', en: 'Reenact the most romantic movie scene you can think of. The group guesses which movie.' }, type: 'mixto' },
  ];

  customCards: ChallengeCard[] = [];
  newCustomText = '';
  newCustomType: 'fisico' | 'erotico' | 'mixto' = 'fisico';

  deck: ChallengeCard[] = [];
  currentCard: ChallengeCard | null = null;
  cardAnim = false;
  history: ChallengeCard[] = [];
  showHistory = false;
  showCustom = false;
  started = false;
  filterType: 'todos' | 'fisico' | 'erotico' | 'mixto' = 'todos';

  get lang(): 'es' | 'en' {
    return (localStorage.getItem('appLang') as 'es' | 'en') || 'es';
  }

  get remaining(): number {
    return this.deck.length;
  }

  ngOnInit() {
    this.loadCustomCards();
  }

  start() {
    this.started = true;
    this.buildDeck();
  }

  buildDeck() {
    const all = [...this.predefinedCards, ...this.customCards];
    this.deck = this.filterType === 'todos'
      ? [...all]
      : all.filter(c => c.type === this.filterType);
    this.shuffleDeck();
    this.history = [];
    this.currentCard = null;
  }

  private shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  drawCard() {
    if (this.deck.length === 0) {
      this.buildDeck();
    }
    this.cardAnim = false;
    setTimeout(() => {
      this.currentCard = this.deck.pop()!;
      this.history.unshift(this.currentCard);
      this.cardAnim = true;
    }, 50);
  }

  addCustomCard() {
    const text = this.newCustomText.trim();
    if (!text) return;
    const card: ChallengeCard = {
      text: { es: text, en: text },
      type: this.newCustomType
    };
    this.customCards.push(card);
    this.newCustomText = '';
    this.newCustomType = 'fisico';
    this.saveCustomCards();
    if (this.started) this.buildDeck();
  }

  removeCustomCard(index: number) {
    this.customCards.splice(index, 1);
    this.saveCustomCards();
    if (this.started) this.buildDeck();
  }

  private saveCustomCards() {
    try {
      localStorage.setItem('hpc_custom', JSON.stringify(this.customCards));
    } catch (_) {}
  }

  private loadCustomCards() {
    try {
      const raw = localStorage.getItem('hpc_custom');
      if (raw) this.customCards = JSON.parse(raw);
    } catch (_) {
      this.customCards = [];
    }
  }

  restart() {
    this.started = false;
    this.currentCard = null;
    this.history = [];
    this.showHistory = false;
    this.cardAnim = false;
  }

  typeLabel(type: string): string {
    const labels: Record<string, Record<string, string>> = {
      fisico:  { es: 'Físico',  en: 'Physical' },
      erotico: { es: 'Erótico', en: 'Erotic' },
      mixto:   { es: 'Mixto',   en: 'Mixed' },
      todos:   { es: 'Todos',   en: 'All' }
    };
    return labels[type]?.[this.lang] ?? type;
  }
}
