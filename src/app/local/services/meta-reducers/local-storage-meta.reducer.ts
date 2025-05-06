import { ActionReducer } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { LocalEncryptedStorageService } from '../local-encrypted-storage.service.ts.service'; // ✅ asegúrate que la ruta y nombre de archivo son correctos

// Instancia directa porque los meta-reducers no usan inyección de Angular
const storageService = new LocalEncryptedStorageService();

export function localStorageMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state, action) {
    const nextState = reducer(state, action);

    // Extraer usuario y gym desde el estado
    const user = nextState.user?.user;
    const userId = user?.id;
    const gymId = user?.gymId;
    const username = user?.username;

    // Si hay sesión activa
    if (userId && gymId && username) {
      // ✅ Guardar slices deseados encriptados
      storageService.save(userId, gymId, 'cashRegisters', nextState.cashRegister);
      storageService.save(userId, gymId, 'sales', nextState.sales);

      // ✅ Guardar identity.json encriptado
      storageService.saveIdentity({
        userId,
        gymId,
        username
      });
    }

    return nextState;
  };
}
