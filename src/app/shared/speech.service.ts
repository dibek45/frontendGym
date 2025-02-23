import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  speak(text: string) {
    // Verifica si la API de síntesis de voz está disponible en el navegador
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; // Configura el idioma para el texto
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('La API de síntesis de voz no está soportada en este navegador.');
    }
  }
}
