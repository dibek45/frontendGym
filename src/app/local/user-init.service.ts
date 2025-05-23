import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
;
import { UserInterface } from 'src/app/auth/user.interface';
import { AppState } from '../state/app.state';
import { setUser } from '../state/user/user.actions';


@Injectable({
  providedIn: 'root'
})
export class UserInitService {
  constructor(
    private localStorage: LocalEncryptedStorageService,
    private store: Store<AppState>
  ) {}
private userLoaded = false;


  async restoreUserFromStorage(): Promise<void> {
    if (this.userLoaded) return; // ⛔ evita múltiples cargas

    const identity = await this.localStorage.loadIdentity();

    if (identity && identity.userId && identity.gymId) {
      const user: UserInterface = {
        id: identity.userId,
        username: identity.username,
        email: identity.username,
        gymId: identity.gymId,
        roll: 0,
        token: ''
      };

      console.log('♻️ Restaurando usuario desde local storage:', user);
      this.userLoaded = true;

      this.store.dispatch(setUser(user));
    } else {
      console.warn('⚠️ No se encontró identity.json en almacenamiento local');
    }
  }
}
