import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

 
  streamEvents(): EventSource {
    return new EventSource(environment.apiUrl);
  }
}
