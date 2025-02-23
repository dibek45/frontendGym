import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

 
  streamEvents(): EventSource {
    return new EventSource('http://localhost:3000/stream');
  }
}
