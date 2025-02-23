import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIAComponent } from './video-ia.component';

describe('VideoIAComponent', () => {
  let component: VideoIAComponent;
  let fixture: ComponentFixture<VideoIAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoIAComponent]
    });
    fixture = TestBed.createComponent(VideoIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
