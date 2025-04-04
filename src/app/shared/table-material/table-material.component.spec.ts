import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMaterialComponent } from './table-material.component';

describe('TableMaterialComponent', () => {
  let component: TableMaterialComponent;
  let fixture: ComponentFixture<TableMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableMaterialComponent]
    });
    fixture = TestBed.createComponent(TableMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
