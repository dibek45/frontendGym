import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPaymentComponent } from './membership-payment.component';

describe('MembershipPaymentComponent', () => {
  let component: MembershipPaymentComponent;
  let fixture: ComponentFixture<MembershipPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembershipPaymentComponent]
    });
    fixture = TestBed.createComponent(MembershipPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
