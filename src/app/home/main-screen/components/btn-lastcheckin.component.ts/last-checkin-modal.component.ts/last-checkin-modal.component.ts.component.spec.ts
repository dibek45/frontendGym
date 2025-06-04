import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastCheckinModalComponentTsComponent } from './last-checkin-modal.component.ts.component';

describe('LastCheckinModalComponentTsComponent', () => {
  let component: LastCheckinModalComponentTsComponent;
  let fixture: ComponentFixture<LastCheckinModalComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastCheckinModalComponentTsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastCheckinModalComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
