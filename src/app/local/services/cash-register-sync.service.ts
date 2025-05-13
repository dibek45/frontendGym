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
  async handleRemoteUpdate(updatedCashRegister: CashRegister): Promise<void> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const { userId, gymId } = identity;

  const list = await this.localStorage.loadTableFromLocalCache<CashRegister>(
    userId,
    gymId,
    'cashRegisters'
  ) ?? [];

  const exists = list.some(c => c.id === updatedCashRegister.id);
  const updatedList = exists
    ? list.map(c => c.id === updatedCashRegister.id ? updatedCashRegister : c)
    : [...list, updatedCashRegister];

  await this.localStorage.saveTableToLocalCache(
    userId,
    gymId,
    'cashRegisters',
    updatedList
  );

  await this.localStorage.saveVersion(
    userId,
    gymId,
    'cashRegisters',
  new Date(updatedCashRegister.updatedAt).toISOString() // 👈 aquí
  );

  this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: updatedList }));
  console.log(`📦 Caja ${updatedCashRegister.id} sincronizada desde WebSocket`);
}

}
