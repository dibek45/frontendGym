import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCasherComponent } from './card-casher.component';

describe('CardCasherComponent', () => {
  let component: CardCasherComponent;
  let fixture: ComponentFixture<CardCasherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCasherComponent]
    });
    fixture = TestBed.createComponent(CardCasherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
