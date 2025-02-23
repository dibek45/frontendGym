import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCasherComponent } from './add-casher.component';

describe('AddCasherComponent', () => {
  let component: AddCasherComponent;
  let fixture: ComponentFixture<AddCasherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCasherComponent]
    });
    fixture = TestBed.createComponent(AddCasherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
