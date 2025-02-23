import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAuthenticationComponent } from './type-authentication.component';

describe('TypeAuthenticationComponent', () => {
  let component: TypeAuthenticationComponent;
  let fixture: ComponentFixture<TypeAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeAuthenticationComponent]
    });
    fixture = TestBed.createComponent(TypeAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
