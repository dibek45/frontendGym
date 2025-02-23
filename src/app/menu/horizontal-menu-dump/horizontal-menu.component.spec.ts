import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalMenuComponent } from './horizontal-menu.component';

describe('HorizontalMenuComponent', () => {
  let component: HorizontalMenuComponent;
  let fixture: ComponentFixture<HorizontalMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalMenuComponent]
    });
    fixture = TestBed.createComponent(HorizontalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
