import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCaptureIaComponent } from './image-capture-ia.component';

describe('ImageCaptureIaComponent', () => {
  let component: ImageCaptureIaComponent;
  let fixture: ComponentFixture<ImageCaptureIaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageCaptureIaComponent]
    });
    fixture = TestBed.createComponent(ImageCaptureIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
