import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

interface FaceLocation {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Face {
  location: FaceLocation;
  name: string;
}

interface ApiResponse {
  names: Face[];
}

@Component({
  selector: 'app-video-ia',
  templateUrl: './video-ia.component.html',
  styleUrls: ['./video-ia.component.scss']
})
export class VideoIAComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private captureInterval$!: Subscription;
  @Output() faceDetected = new EventEmitter<string>(); // Emite el nombre detectado

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.startCamera();
    this.startAutoCapture();
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando el componente se destruye
    if (this.captureInterval$) {
      this.captureInterval$.unsubscribe();
    }
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
      })
      .catch(err => {
        console.error("Error accessing camera: ", err);
      });
  }

  startAutoCapture() {
    this.captureInterval$ = interval(1000).subscribe(() => {
      this.captureAndUploadImage();
    });
  }

  captureAndUploadImage() {
    const videoElement = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/png').split(',')[1]; // Extrae la cadena Base64
      
      this.uploadImage(base64Image);
    } else {
      console.error("Error getting 2D context");
    }
  }

  uploadImage(base64Image: string) {
    const jsonPayload = {
      image: base64Image
    };

    this.http.post('http://127.0.0.1:5000/process_image_base64', jsonPayload, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(response => {
      console.log('Upload successful', response);
      this.drawFaces(response as ApiResponse); // Llama a drawFaces con la respuesta del backend
    }, error => {
      console.error('Upload error', error);
    });
  }

  drawFaces(response: ApiResponse) {
    console.log("Inicia drawFaces");

    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error("Error getting 2D context");
      return;
    }

    const video = this.videoElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Limpia el canvas antes de dibujar
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja el video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const faces = response.names;
    console.log("Faces data:", faces);

    if (!faces || faces.length === 0) {
      console.warn("No faces found in response");
      return;
    }

    faces.forEach(face => {
      const { top, right, bottom, left } = face.location;
      const name = face.name;

      console.log(`Drawing face: top=${top}, right=${right}, bottom=${bottom}, left=${left}`);

      // Dibuja un rectángulo alrededor de la cara
      context.beginPath();
      context.rect(left, top, right - left, bottom - top);
      context.lineWidth = 4; // Cambia el grosor del contorno del rectángulo
      context.strokeStyle = 'blue';
      context.stroke();

      // Dibuja el nombre
      context.font = 'bold 24px Arial'; // Cambiado a 'bold' y tamaño de 24px para que sea más grueso y grande
      context.fillStyle = 'blue'; // Cambiado a verde
      context.textAlign = 'center';
      context.fillText(name, left + (right - left) / 2, top > 10 ? top - 10 : 10);
      this.faceDetected.emit(name);
    });
  }
}
