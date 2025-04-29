import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryWeeklyBottomSectionComponent } from './summary-weekly-bottom-section.component';

describe('SummaryWeeklyBottomSectionComponent', () => {
  let component: SummaryWeeklyBottomSectionComponent;
  let fixture: ComponentFixture<SummaryWeeklyBottomSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryWeeklyBottomSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryWeeklyBottomSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
