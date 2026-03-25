import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {

  messageNext = '';
  title = '';
  updates: any[] = [];
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTexts();

    this.translate.onLangChange.subscribe(() => {
      this.loadTexts();
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadTexts();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private loadTexts(): void {
    this.updateTexts();
    this.setRandomMessage();
  }

  private updateTexts() {
    this.translate.get('NEWS.TITLE').subscribe(text => (this.title = text));

    this.translate.get('NEWS.UPDATES').subscribe((updates: any[]) => {
      this.updates = updates;
    });
  }

  private setRandomMessage(): void {
    this.translate.get('NEWS.RANDOM_MESSAGES').subscribe((messages: string[]) => {
      const index = Math.floor(Math.random() * messages.length);
      this.messageNext = messages[index];
    });
  }
}
