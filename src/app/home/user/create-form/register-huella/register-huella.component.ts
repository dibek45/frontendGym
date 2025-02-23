import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-huella',
  templateUrl: './register-huella.component.html',
  styleUrls: ['./register-huella.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule]
})
export class RegisterHuellaComponent implements OnChanges {
  @Input() rellene: number = -1; // Input para iniciar la línea azul
  @Input() scanning: number = -1; // Input para iniciar la línea azul

  isScanning: boolean = false; // Controla la animación completa (huella)
  isLineAnimating: boolean = false; // Controla la animación de la línea azul

  ngOnChanges(changes: SimpleChanges) {
    // Verifica si 'accion' ha cambiado
    if (changes['rellene']) {
      if (this.rellene === 0) {
        if (this.scanning!=0) {
          this.startLineScaning();
        }
        
      } else {
        this.stopLineAnimation();
      }
    }

    if (changes['scanning']) {
        
            if (this.scanning!=0) {
              this.startLineScaning();
            }
     
    }
  }

  toggleScanning() {
    this.isScanning = !this.isScanning; 
    if (this.isScanning) {
      this.isLineAnimating = false; // Detiene la animación de la línea azul al iniciar el escaneo
    } else {
      this.startFingerprintAnimation();
    }
  }

  startLineScaning() {
    setTimeout(() => {
      this.isLineAnimating = true;
    }, 500); // 1000 ms = 1 segundo
  }

  stopLineAnimation() {
    this.isLineAnimating = false;
    this.startFingerprintAnimation();
  }

  startFingerprintAnimation() {
    this.isScanning = true; // Inicia la animación de la huella
  }


  

  toggleLineAnimation() {
    if (!this.isScanning) { // Permite iniciar la animación de la línea azul solo si no está escaneando
      this.isLineAnimating = !this.isLineAnimating;
    }
}
}
