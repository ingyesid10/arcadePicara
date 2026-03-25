import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {

  private activeGameId: string | null = null;
  private activeGameName: string | null = null;
  private startTime: number | null = null;

  constructor() {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
  }

  // ── Utilidad interna ─────────────────────────────────────────

  private pushEvent(event: string, data: Record<string, any> = {}): void {
    const payload = { event, ...data, timestamp: new Date().toISOString() };
    window.dataLayer.push(payload);
  }

  /** Envía un evento directamente a GA4 via gtag */
  private ga4(eventName: string, params: Record<string, any> = {}): void {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  // ── Eventos de juego ─────────────────────────────────────────

  /** Juego abierto */
  pushGameOpen(game: { id: string; name: string; categories?: string[] }): void {
    this.activeGameId = game.id;
    this.activeGameName = game.name;
    this.startTime = Date.now();

    const category = game.categories?.join(', ') || 'sin_categoria';

    this.pushEvent('minijuego_abierto', {
      game_id: game.id,
      game_name: game.name,
      category
    });

    this.ga4('select_content', {
      content_type: 'minijuego',
      item_id: game.id,
      content_id: game.id
    });
  }

  /** Juego cerrado — registra tiempo de sesión en el juego */
  pushGameClose(): void {
    if (this.activeGameId && this.startTime) {
      const duration = Math.round((Date.now() - this.startTime) / 1000);

      this.pushEvent('minijuego_cerrado', {
        game_id: this.activeGameId,
        game_name: this.activeGameName,
        duration_seconds: duration
      });

      this.ga4('minijuego_cerrado', {
        game_id: this.activeGameId,
        game_name: this.activeGameName,
        duration_seconds: duration,
        engagement_time_msec: duration * 1000
      });

      this.activeGameId = null;
      this.activeGameName = null;
      this.startTime = null;
    }
  }

  /** Carta / ronda jugada dentro de un juego */
  pushCardPlayed(gameId: string, extras: Record<string, any> = {}): void {
    this.pushEvent('carta_jugada', { game_id: gameId, ...extras });
    this.ga4('carta_jugada', { game_id: gameId, ...extras });
  }

  /** Nivel / intensidad seleccionado */
  pushLevelSelected(gameId: string, levels: string[]): void {
    this.pushEvent('nivel_seleccionado', { game_id: gameId, levels: levels.join(',') });
    this.ga4('nivel_seleccionado', { game_id: gameId, levels: levels.join(',') });
  }

  /** Juego iniciado (tras elegir config) */
  pushGameStarted(gameId: string, config: Record<string, any> = {}): void {
    this.pushEvent('juego_iniciado', { game_id: gameId, ...config });
    this.ga4('juego_iniciado', { game_id: gameId, ...config });
  }

  // ── Eventos de navegación ────────────────────────────────────

  pushCategorySelect(category: string): void {
    this.pushEvent('categoria_seleccionada', { category });
    this.ga4('select_item', { item_list_name: category });
  }

  pushReturnHome(): void {
    this.pushGameClose();
    this.pushEvent('volver_home');
    this.ga4('volver_home');
  }

  pushLanguageChange(lang: string): void {
    this.pushEvent('cambio_idioma', { idioma: lang });
    this.ga4('cambio_idioma', { idioma: lang });
  }

  /** Scroll o engagement prolongado en la app */
  pushEngagement(seconds: number): void {
    this.ga4('user_engagement', { engagement_time_msec: seconds * 1000 });
  }
}

