import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosDelDiaModalComponent } from './gastos-del-dia-modal.component';

describe('GastosDelDiaModalComponent', () => {
  let component: GastosDelDiaModalComponent;
  let fixture: ComponentFixture<GastosDelDiaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosDelDiaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GastosDelDiaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
