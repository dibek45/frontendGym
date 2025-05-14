import { Injectable } from '@angular/core';
import { LocalEncryptedStorageService } from './local-encrypted-storage.service';
import { UpdateVersionService } from './update-version.service';
import { SyncServiceDispatcher } from './sync-service-dispatcher.service';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { loadedMembers } from 'src/app/state/member/member.actions';
import { SocketService } from 'src/app/login/socket.service';
import { Store } from '@ngrx/store';

import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { MemberModel } from 'src/app/core/models/member.interface';
import { ProductModel } from 'src/app/core/models/product.interface';
import * as ProductActions from 'src/app/state/product/product.actions';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private localStorage: LocalEncryptedStorageService,
    private updateVersionService: UpdateVersionService,
    private dispatcher: SyncServiceDispatcher,
    private socketService: SocketService,
    private store: Store
  ) {
    this.subscribeToCashRegisterUpdates();
    this.subscribeToMemberUpdates();
    this.subscribeToProductUpdates();
  }

  // 🔁 Actualización de cajas por socket
  private subscribeToCashRegisterUpdates() {
    this.socketService.cashRegisterUpdated$.subscribe(async (updated: CashRegister) => {
      console.log('📨 Caja actualizada recibida por socket:', updated);
      const identity = await this.localStorage.loadIdentity();
      if (!identity) return;

      const userId = identity.userId;
      const gymId = identity.gymId;

      const list = await this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters') || [];
      const updatedList = [...list.filter(c => c.id !== updated.id), updated];

      await this.localStorage.saveTableToLocalCache(userId, gymId, 'cashRegisters', updatedList);
      await this.localStorage.saveVersion(userId, gymId, 'cashRegisters', updated.updatedAt?.toString() || new Date().toISOString());

      this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: updatedList }));
      console.log('✅ Caja actualizada localmente y en Redux');
    });
  }

  // 🔁 Actualización de miembros por socket
  private subscribeToMemberUpdates() {
    this.socketService.memberUpdated$.subscribe(async (updated: MemberModel) => {
      console.log('📨 Miembro actualizado recibido por socket:', updated);
      const identity = await this.localStorage.loadIdentity();
      if (!identity) return;

      const userId = identity.userId;
      const gymId = identity.gymId;

      const list = await this.localStorage.loadTableFromLocalCache<MemberModel>(userId, gymId, 'members') || [];
      const updatedList = [...list.filter(m => m.id !== updated.id), updated].map(m => ({
        ...m,
        updatedAt: m.updatedAt ?? new Date().toISOString()
      }));

      await this.localStorage.saveTableToLocalCache(userId, gymId, 'members', updatedList);
      await this.localStorage.saveVersion(userId, gymId, 'members', updated.updatedAt?.toString() || new Date().toISOString());

      this.store.dispatch(loadedMembers({ members: updatedList }));
      console.log('✅ Miembro actualizado localmente y en Redux');
    });
  }

  // 🔁 Actualización de productos por socket
  private subscribeToProductUpdates() {
    this.socketService.productUpdated$.subscribe(async (updated: ProductModel) => {
      console.log('📨 Producto actualizado recibido por socket:', updated);
      const identity = await this.localStorage.loadIdentity();
      if (!identity) return;

      const userId = identity.userId;
      const gymId = identity.gymId;

      const list = await this.localStorage.loadTableFromLocalCache<ProductModel>(userId, gymId, 'products') || [];
      const updatedList = [...list.filter(p => p.id !== updated.id), updated];

const enrichedList = updatedList.map(p => ({
  ...p,
  updatedAt: p.updatedAt ?? new Date().toISOString()
}));

await this.localStorage.saveTableToLocalCache(userId, gymId, 'products', enrichedList);
      await this.localStorage.saveVersion(userId, gymId, 'products', updated.updatedAt?.toString() || new Date().toISOString());

      this.store.dispatch(ProductActions.loadedProducts({ products: updatedList }));
      console.log('✅ Producto actualizado localmente y en Redux');
    });
  }

  // 🔄 Verifica si se necesita sincronizar una tabla
  async syncTableIfNeeded(table: string): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const versionMap = await this.updateVersionService.getVersionMapByGym(identity.gymId);
    const remoteUpdatedAt = versionMap.get(table);
    if (!remoteUpdatedAt) {
      alert(`⚠️ No hay updatedAt remoto para ${table}`);
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

  // 🔁 Ejecutar sync al iniciar la app
  async syncAllTablesOnStartup(): Promise<void> {
    await this.syncTableIfNeeded('cashRegisters');
    await this.syncTableIfNeeded('members');
    await this.syncTableIfNeeded('products');
  }
}
