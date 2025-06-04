import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaMovimientosModalComponentComponent } from './caja-movimientos-modal-component.component';

describe('CajaMovimientosModalComponentComponent', () => {
  let component: CajaMovimientosModalComponentComponent;
  let fixture: ComponentFixture<CajaMovimientosModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajaMovimientosModalComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CajaMovimientosModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
