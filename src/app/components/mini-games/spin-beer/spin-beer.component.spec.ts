import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinBeerComponent } from './spin-beer.component';

describe('SpinBeerComponent', () => {
  let component: SpinBeerComponent;
  let fixture: ComponentFixture<SpinBeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinBeerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpinBeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
