import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionDetailsComponent } from './promotion-details.component';

describe('PromotionDetailsComponent', () => {
  let component: PromotionDetailsComponent;
  let fixture: ComponentFixture<PromotionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionDetailsComponent]
    });
    fixture = TestBed.createComponent(PromotionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
