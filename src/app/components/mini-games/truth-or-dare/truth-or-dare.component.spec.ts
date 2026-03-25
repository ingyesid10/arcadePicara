import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruthOrDareComponent } from './truth-or-dare.component';

describe('TruthOrDareComponent', () => {
  let component: TruthOrDareComponent;
  let fixture: ComponentFixture<TruthOrDareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruthOrDareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TruthOrDareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
