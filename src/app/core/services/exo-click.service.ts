import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExoClickService {
  private scriptLoaded = false;

  loadPopunder(): void {
    if (this.scriptLoaded) return;
    this.scriptLoaded = true;

    console.log('🚀 Iniciando carga del script de ExoClick...');

    const script = document.createElement('script');
    script.type = 'application/javascript';
    script.text = `
      (function() {
        console.log('📜 Iniciando función interna de ExoClick...');

        // Configuración del anuncio
        var adConfig = {
          "ads_host": "a.pemsrv.com",
          "syndication_host": "s.pemsrv.com",
          "idzone": 5757016,
          "popup_fallback": false,
          "popup_force": false,
          "chrome_enabled": true,
          "new_tab": false,
          "frequency_period": 720,
          "frequency_count": 1,
          "trigger_method": 5,
          "trigger_class": "game-card",
          "trigger_delay": 0,
          "capping_enabled": true,
          "tcf_enabled": false, // 🔧 Desactivado para evitar bloqueo por consentimiento
          "only_inline": false
        };

        // Comprobación de los elementos de activación
        var triggers = document.querySelectorAll('.game-card');
        if (triggers.length === 0) {
          console.warn('⚠️ No se encontraron elementos con clase .game-card al cargar el script.');
        } else {
          console.log('🎮 Detectados ' + triggers.length + ' elementos con clase .game-card — listos para el popunder.');
        }

        // Carga del script oficial de ExoClick
        var popScript = document.createElement('script');
        popScript.src = 'https://a.pemsrv.com/popunder1000.js';
        popScript.async = true;

        popScript.onload = function() {
          console.log('🟢 Popunder script loaded correctamente (ExoClick).');
          let attempts = 0;
          const maxAttempts = 20;

          const checkPopMagic = setInterval(() => {
            attempts++;
            if (typeof window["popMagic"] !== "undefined" && typeof window["popMagic"].init === "function") {
              clearInterval(checkPopMagic);
              console.log('🔥 popMagic detectado tras ' + attempts + ' intentos. Inicializando...');
              window["popMagic"].init(adConfig);
              console.log('🎯 Popunder inicializado correctamente.');
            } else {
              console.log('⏳ Esperando a que popMagic esté disponible... intento ' + attempts);
              if (attempts >= maxAttempts) {
                clearInterval(checkPopMagic);
                console.error('❌ popMagic no se inicializó tras varios intentos.');
              }
            }
          }, 500);
        };

        popScript.onerror = function() {
          console.error('❌ Error al cargar el script de ExoClick');
        };

        document.body.appendChild(popScript);
      })();
    `;

    document.body.appendChild(script);
  }
}
