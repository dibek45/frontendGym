import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCashRegisterItemComponent } from './card-cash-register-item.component';

describe('CardCashRegisterItemComponent', () => {
  let component: CardCashRegisterItemComponent;
  let fixture: ComponentFixture<CardCashRegisterItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCashRegisterItemComponent]
    });
    fixture = TestBed.createComponent(CardCashRegisterItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
