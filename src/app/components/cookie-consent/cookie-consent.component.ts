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
    // Aquí puedes cargar tus scripts de anuncios o analytics
    this.loadAdsScript();
  }

  rejectCookies() {
    localStorage.setItem('cookie-consent', 'rejected');
    this.showBanner = false;
  }

  private loadAdsScript() {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.setAttribute('data-ad-client', 'TU_ID_DE_CLIENTE'); // Ejemplo: ca-pub-xxxxxxxxxx
    document.head.appendChild(script);
  }
}
