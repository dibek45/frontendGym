import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLastcheckinComponentTsComponent } from './btn-lastcheckin.component.ts.component';

describe('BtnLastcheckinComponentTsComponent', () => {
  let component: BtnLastcheckinComponentTsComponent;
  let fixture: ComponentFixture<BtnLastcheckinComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnLastcheckinComponentTsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnLastcheckinComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
