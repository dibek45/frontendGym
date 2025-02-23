import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterHuellaComponent } from './register-huella.component';

describe('RegisterHuellaComponent', () => {
  let component: RegisterHuellaComponent;
  let fixture: ComponentFixture<RegisterHuellaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterHuellaComponent]
    });
    fixture = TestBed.createComponent(RegisterHuellaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
