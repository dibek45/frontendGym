import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncToastComponent } from './sync-toast.component';

describe('SyncToastComponent', () => {
  let component: SyncToastComponent;
  let fixture: ComponentFixture<SyncToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SyncToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
