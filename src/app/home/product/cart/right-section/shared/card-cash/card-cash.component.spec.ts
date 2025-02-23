import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCashComponent } from './card-cash.component';

describe('CardCashComponent', () => {
  let component: CardCashComponent;
  let fixture: ComponentFixture<CardCashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCashComponent]
    });
    fixture = TestBed.createComponent(CardCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
