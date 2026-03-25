import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KissRouletteComponent } from './kiss-roulette.component';

describe('KissRouletteComponent', () => {
  let component: KissRouletteComponent;
  let fixture: ComponentFixture<KissRouletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KissRouletteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KissRouletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
