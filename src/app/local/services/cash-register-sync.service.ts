import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { CashRegisterService } from '../../state/point-of-sale/cash-register/cash-register.service';
import { CashRegisterActions } from '../../state/point-of-sale/cash-register/cash-register.actions';
import { CashRegister } from '../../state/point-of-sale/cash-register/cash-register.model';

@Injectable({ providedIn: 'root' })
export class CashRegisterSyncService {
  constructor(
    private store: Store,
    private cashRegisterService: CashRegisterService,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async syncOnAppStart(remoteUpdatedAt: string): Promise<void> {
    console.log('🟡 Iniciando sincronización de cashRegisters...');
  
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      console.warn('❌ No hay identidad cargada. Cancelando sincronización.');
      return;
    }
  
    const userId = identity.userId;
    const gymId = identity.gymId;
  
    console.log(`📄 Identity detectada: userId=${userId}, gymId=${gymId}`);
    console.log(`🌐 Versión remota simulada: ${remoteUpdatedAt}`);
  
    const needsUpdate = await this.localStorage.isRemoteVersionNewer(
      userId,
      gymId,
      'cashRegisters',
      remoteUpdatedAt
    );
  
    if (needsUpdate) {
      console.log('🔄 Versión local desactualizada. Cargando desde backend...');
      const data = await this.cashRegisterService.getCashRegistersWithCache(true);
      console.log(`✅ Datos recibidos del backend: ${data.length} registros`);
  
      this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: data }));
      console.log('📦 Store actualizado con datos del backend');
    } else {
      console.log('✅ La versión local está actualizada. Cargando desde caché local...');
      const data = await this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters');
      console.log(`📂 Datos locales cargados: ${data?.length ?? 0} registros`);
  
      this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: data ?? [] }));
      console.log('📦 Store actualizado con datos locales');
    }
  
    console.log('🟢 Sincronización de cashRegisters completada.\n');
  }
  
}
