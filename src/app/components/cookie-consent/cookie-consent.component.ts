import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent {
  showBanner = false;

  ngOnInit() {
    const consent = localStorage.getItem('cookie-consent');
    this.showBanner = consent !== 'accepted';
  }

  acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    this.showBanner = false;
    // No cargar scripts externos de anuncios
  }

  rejectCookies() {
    localStorage.setItem('cookie-consent', 'rejected');
    this.showBanner = false;
  }

  // Eliminado: No cargar AdSense ni scripts externos
  // private loadAdsScript() { ... }
}
