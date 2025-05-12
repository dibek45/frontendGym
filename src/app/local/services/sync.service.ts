import { Injectable } from '@angular/core';
import { LocalEncryptedStorageService } from './local-encrypted-storage.service';
import { UpdateVersionService } from './update-version.service';
import { SyncServiceDispatcher } from './sync-service-dispatcher.service';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { SocketService } from 'src/app/login/socket.service';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(
    private localStorage: LocalEncryptedStorageService,
    private updateVersionService: UpdateVersionService,
    private dispatcher: SyncServiceDispatcher,
    private socketService:SocketService,
    private store: Store
  ) {






    this.socketService.cashRegisterUpdated$.subscribe(async (updated: CashRegister) => {
  console.log('📨 Caja actualizada recibida por socket:', updated);

  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const userId = identity.userId;
  const gymId = identity.gymId;

  // 1️⃣ Leer cajas actuales desde cache
  const list = await this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters') || [];

  // 2️⃣ Reemplazar o insertar caja
  const updatedList = [
    ...list.filter(c => c.id !== updated.id),
    updated
  ];

  // 3️⃣ Guardar en cache local
  await this.localStorage.saveTableToLocalCache(userId, gymId, 'cashRegisters', updatedList);

  // 4️⃣ Actualizar la tabla de versiones local
  await this.localStorage.saveVersion(userId, gymId, 'cashRegisters', updated.updatedAt?.toString() || new Date().toISOString());

  // 5️⃣ Despachar al store
  this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: updatedList }));

  console.log('✅ Caja actualizada localmente y en Redux');
});





  }

  async syncTableIfNeeded(table: string): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const versionMap = await this.updateVersionService.getVersionMapByGym(identity.gymId);
    const remoteUpdatedAt = versionMap.get(table);

    if (!remoteUpdatedAt) {
    alert('⚠️ No hay updatedAt remoto para cashRegisters');
    return;
    }
    console.log('-----------------------------------------------------');

    const localVersion = await this.localStorage.getVersion(identity.userId, identity.gymId, table);
console.log(`📅 Versión remota de ${table}:`, remoteUpdatedAt);
console.log(`📅 Versión local de ${table}:`, localVersion);
    const shouldSync = await this.localStorage.shouldSyncTable(
      identity.userId,
      identity.gymId,
      table,
      remoteUpdatedAt
    );

    if (shouldSync) {
     alert(`🔄 ${table} desactualizado. Ejecutando sync...`);
      await this.dispatcher.dispatch(table);
    } else {
      console.log(`✅ ${table} está actualizado.`);
    }
  }

  async syncAllTablesOnStartup(): Promise<void> {
    await this.syncTableIfNeeded('cashRegisters');
    // En el futuro: await this.syncTableIfNeeded('sales'); etc.
  }
}
