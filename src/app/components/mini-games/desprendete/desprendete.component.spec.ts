import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesprendeteComponent } from './desprendete.component';

describe('DesprendeteComponent', () => {
  let component: DesprendeteComponent;
  let fixture: ComponentFixture<DesprendeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesprendeteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesprendeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
