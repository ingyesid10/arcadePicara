import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CombinacionesService {
  // private dataUrl = environment.jsonData;
  // private dataUrlRuleta = environment.jsonDataRuleta;
  private dataUrlVerdadReto =environment.dataUrlVerdadReto;

  constructor(private http: HttpClient, private translate: TranslateService) {
    console.log('🧠 Environment activo:', environment);
  }

  getCombinaciones(lang?: 'es' | 'en'): Observable<any> {
    const currentLang = lang || (this.translate.currentLang as 'es' | 'en') || 'es';
    const url =
      currentLang === 'en'
        ? environment.jsonDataEN
        : environment.jsonDataES;

    console.log(`🌍 Cargando combinaciones (${currentLang}):`, url);
    return this.http.get<any>(url);
  }

  getCombinacionesOral(lang?: 'es' | 'en'): Observable<any> {
    const currentLang = lang || (this.translate.currentLang as 'es' | 'en') || 'es';
    const url =
      currentLang === 'en'
        ? environment.jsonDataOralEN
        : environment.jsonDataOralES;

    console.log(`🌍 Cargando combinaciones (${currentLang}):`, url);
    return this.http.get<any>(url);
  }

  getCombinacionesRuleta(lang: 'es' | 'en'): Observable<any> {
    const url = lang === 'en' ? environment.jsonDataRuletaEN : environment.jsonDataRuletaES;
    console.log(`🌐 Cargando combinaciones (${lang}):`, url);
    return this.http.get<any>(url);
  }

  // 🔹 Nuevo método que acepta idioma
  getVerdadRetoExtremo(lang: 'es' | 'en' = 'es'): Observable<any> {
    const url = lang === 'en' ? environment.jsonDataRuletaPrendaEN : environment.jsonDataRuletaPrendaES;
    console.log(`📦 Cargando VERDAD/RETO extremo (${lang}):`, url);
    return this.http.get<any>(url);
  }
}
