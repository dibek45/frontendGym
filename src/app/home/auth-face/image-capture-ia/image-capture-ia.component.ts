import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-capture-ia',
  templateUrl: './image-capture-ia.component.html',
  styleUrls: ['./image-capture-ia.component.scss']
})
export class ImageCaptureIaComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @Output() faceDetected = new EventEmitter<string>(); // Emite el nombre detectado
  imageCaptured: string | null = null; // Variable para almacenar la imagen capturada

  constructor(){}

  ngOnInit(): void {
    this.startVideo();
  }

  startVideo(): void {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error('Error accessing webcam:', error);
      });
  }

  verify(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    // Set canvas dimensions to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas image to Base64
      const base64Image = canvas.toDataURL('image/png').split(',')[1]; // Extrae la cadena Base64
      this.imageCaptured = canvas.toDataURL('image/png')
      // Log the Base64 image data
      console.log('Captured Image Base64:', base64Image);

      // Emit the image data or process it further
      this.faceDetected.emit(base64Image);
    }
  }

  refresh(){
    this.imageCaptured = null; // Clear the captured image
    this.startVideo(); // Restart the video stream

  }

}
