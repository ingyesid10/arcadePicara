import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherLowerShotComponent } from './higher-lower-shot.component';

describe('HigherLowerShotComponent', () => {
  let component: HigherLowerShotComponent;
  let fixture: ComponentFixture<HigherLowerShotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HigherLowerShotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HigherLowerShotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
