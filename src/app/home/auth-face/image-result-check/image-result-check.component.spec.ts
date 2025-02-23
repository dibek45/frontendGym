import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageResultCheckComponent } from './image-result-check.component';

describe('ImageResultCheckComponent', () => {
  let component: ImageResultCheckComponent;
  let fixture: ComponentFixture<ImageResultCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageResultCheckComponent]
    });
    fixture = TestBed.createComponent(ImageResultCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
