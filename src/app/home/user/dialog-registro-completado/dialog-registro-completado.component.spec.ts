import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistroCompletadoComponent } from './dialog-registro-completado.component';

describe('DialogRegistroCompletadoComponent', () => {
  let component: DialogRegistroCompletadoComponent;
  let fixture: ComponentFixture<DialogRegistroCompletadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogRegistroCompletadoComponent]
    });
    fixture = TestBed.createComponent(DialogRegistroCompletadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
