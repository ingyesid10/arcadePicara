import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoulettePartyComponent } from './roulette-hot-party.component';

describe('RoulettePartyComponent', () => {
  let component: RoulettePartyComponent;
  let fixture: ComponentFixture<RoulettePartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoulettePartyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoulettePartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
