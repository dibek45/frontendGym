import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCreateListComponent } from './search-create-list.component';

describe('SearchCreateListComponent', () => {
  let component: SearchCreateListComponent;
  let fixture: ComponentFixture<SearchCreateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchCreateListComponent]
    });
    fixture = TestBed.createComponent(SearchCreateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
