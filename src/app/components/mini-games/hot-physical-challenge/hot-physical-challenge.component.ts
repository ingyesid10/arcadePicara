import { Component } from '@angular/core';

interface ChallengeCard {
  text: { es: string; en: string };
  type: 'fisico' | 'erotico' | 'mixto';
}

@Component({
  selector: 'app-hot-physical-challenge',
  templateUrl: './hot-physical-challenge.component.html',
  styleUrls: ['./hot-physical-challenge.component.css']
})
export class HotPhysicalChallengeComponent {
  predefinedCards: ChallengeCard[] = [
    { text: { es: 'Haz 10 sentadillas mientras tu pareja te besa el cuello.', en: 'Do 10 squats while your partner kisses your neck.' }, type: 'fisico' },
    { text: { es: 'Haz un baile erótico de 30 segundos para el grupo o tu pareja.', en: 'Do a 30-second erotic dance for the group or your partner.' }, type: 'erotico' },
    { text: { es: 'Mantén contacto visual con alguien durante 1 minuto sin reírte. Si fallas, bebe.', en: 'Hold eye contact with someone for 1 minute without laughing. If you fail, drink.' }, type: 'fisico' },
    { text: { es: 'Haz una plancha mientras alguien te acaricia la espalda.', en: 'Do a plank while someone caresses your back.' }, type: 'fisico' },
    { text: { es: 'Deja que el grupo elija una parte de tu cuerpo para que te den un masaje de 1 minuto.', en: 'Let the group choose a part of your body to receive a 1-minute massage.' }, type: 'mixto' },
    { text: { es: 'Haz un “body shot” (beber de la piel de alguien).', en: 'Do a body shot (drink from someone’s skin).' }, type: 'erotico' },
    { text: { es: 'Simula una posición sexual (sin quitarse la ropa) durante 20 segundos.', en: 'Simulate a sexual position (clothed) for 20 seconds.' }, type: 'erotico' },
    { text: { es: 'Haz un reto de “verdad o reto” físico: si no lo cumples, quítate una prenda.', en: 'Do a physical “truth or dare” challenge: if you fail, remove a piece of clothing.' }, type: 'mixto' },
    { text: { es: 'Haz flexiones mientras tu pareja se sienta sobre tu espalda.', en: 'Do push-ups while your partner sits on your back.' }, type: 'fisico' },
    { text: { es: 'Elige a alguien para que te dé un beso donde el grupo decida (no zonas íntimas).', en: 'Choose someone to give you a kiss wherever the group decides (not intimate areas).' }, type: 'erotico' }
  ];

  customCards: ChallengeCard[] = [];
  newCustomTextES = '';
  newCustomTextEN = '';
  newCustomType: 'fisico' | 'erotico' | 'mixto' = 'fisico';

  deck: ChallengeCard[] = [];
  currentCard: ChallengeCard | null = null;
  history: ChallengeCard[] = [];

  ngOnInit() {
    this.resetDeck();
  }

  resetDeck() {
    this.deck = [...this.predefinedCards, ...this.customCards];
    this.history = [];
    this.currentCard = null;
  }

  drawCard() {
    if (this.deck.length === 0) {
      this.resetDeck();
    }
    const idx = Math.floor(Math.random() * this.deck.length);
    this.currentCard = this.deck.splice(idx, 1)[0];
    this.history.push(this.currentCard);
  }

  addCustomCard() {
    if (this.newCustomTextES.trim() && this.newCustomTextEN.trim()) {
      this.customCards.push({ text: { es: this.newCustomTextES.trim(), en: this.newCustomTextEN.trim() }, type: this.newCustomType });
      this.newCustomTextES = '';
      this.newCustomTextEN = '';
      this.newCustomType = 'fisico';
      this.resetDeck();
    }
  }

  removeCustomCard(index: number) {
    this.customCards.splice(index, 1);
    this.resetDeck();
  }

  get lang(): 'es' | 'en' {
    return (localStorage.getItem('appLang') as 'es' | 'en') || 'es';
  }
}
