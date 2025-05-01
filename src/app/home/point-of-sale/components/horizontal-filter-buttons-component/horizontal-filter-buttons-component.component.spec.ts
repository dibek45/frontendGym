import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalFilterButtonsComponentComponent } from './horizontal-filter-buttons-component.component';

describe('HorizontalFilterButtonsComponentComponent', () => {
  let component: HorizontalFilterButtonsComponentComponent;
  let fixture: ComponentFixture<HorizontalFilterButtonsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalFilterButtonsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorizontalFilterButtonsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
