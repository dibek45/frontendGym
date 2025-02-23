import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private isLoginSubject = new BehaviorSubject<boolean>(false);

  setLoginStatus(status: boolean) {
    this.isLoginSubject.next(status);
  }

  getLoginStatus() {
    return this.isLoginSubject.asObservable();
  }
}
