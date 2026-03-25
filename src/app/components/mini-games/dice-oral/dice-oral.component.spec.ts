import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceOralComponent } from './dice-oral.component';

describe('DiceOralComponent', () => {
  let component: DiceOralComponent;
  let fixture: ComponentFixture<DiceOralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiceOralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiceOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
