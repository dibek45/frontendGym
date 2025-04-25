import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtnCreateSearchComponent } from './ctn-create-search.component';

describe('CtnCreateSearchComponent', () => {
  let component: CtnCreateSearchComponent;
  let fixture: ComponentFixture<CtnCreateSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CtnCreateSearchComponent]
    });
    fixture = TestBed.createComponent(CtnCreateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
