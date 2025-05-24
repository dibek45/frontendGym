import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { UserInterface } from 'src/app/auth/user.interface';
import { AppState } from '../state/app.state';
import { setUser } from '../state/user/user.actions';
import { CashRegister } from '../state/point-of-sale/cash-register/cash-register.model';
import { setCajaState } from '../state/user/session/user-session.actions';

@Injectable({
  providedIn: 'root'
})
export class UserInsitService {
  private userLoaded = false;

  constructor(
    private localStorage: LocalEncryptedStorageService,
    private store: Store<AppState>
  ) {}

  async restoreUserFromStorage(): Promise<void> {
    if (this.userLoaded) return;

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

      // 🔁 Cargar caja también
      const cajas = await this.localStorage.loadTableFromLocalCache<CashRegister>(
        identity.userId,
        identity.gymId,
        'cashRegisters'
      ) || [];

      const cajaAbierta = cajas.find(c => c.status === 'open');
      const currentBalance = cajaAbierta?.currentBalance || 0;
      const cajaStatus = cajaAbierta ? 'open' : 'closed';

      this.store.dispatch(setCajaState({
        currentBalance,
        cajaStatus
      }));

      console.log('💰 Caja restaurada desde local:', currentBalance);
    } else {
      console.warn('⚠️ No se encontró identity.json en almacenamiento local');
    }
  }
}
