import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {

  private activeGameId: string | null = null;
  private startTime: number | null = null;

  constructor() {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
  }

  /**
   * Envía un evento genérico al dataLayer
   */
  pushEvent(event: string, data: Record<string, any> = {}): void {
    const payload = {
      event,
      ...data,
      timestamp: new Date().toISOString()
    };

    window.dataLayer.push(payload);
    console.log('📊 DataLayer push:', payload);
  }

  /**
   * Envía un evento cuando se abre un minijuego
   */
  pushGameOpen(game: {
    id: string;
    name: string;
    categories?: string[];
  }): void {
    this.activeGameId = game.id;
    this.startTime = Date.now();

    this.pushEvent('minijuego_abierto', {
      game_id: game.id,
      game_name: game.name,
      category: game.categories?.join(', ') || 'sin_categoria'
    });
  }

  /**
   * Envía un evento cuando el usuario cierra un minijuego
   */
  pushGameClose(): void {
    if (this.activeGameId && this.startTime) {
      const duration = Math.round((Date.now() - this.startTime) / 1000); // segundos

      this.pushEvent('minijuego_cerrado', {
        game_id: this.activeGameId,
        duration_seconds: duration
      });

      this.activeGameId = null;
      this.startTime = null;
    }
  }

  /**
   * Envía un evento cuando se selecciona una categoría
   */
  pushCategorySelect(category: string): void {
    this.pushEvent('categoria_seleccionada', { category });
  }

  /**
   * Envía un evento cuando el usuario vuelve al home
   */
  pushReturnHome(): void {
    this.pushEvent('volver_home');
    this.pushGameClose(); // 🕒 también cierra el conteo si había un juego abierto
  }

  /**
   * Envía un evento cuando cambia el idioma
   */
  pushLanguageChange(lang: string): void {
    this.pushEvent('cambio_idioma', { idioma: lang });
  }
}
