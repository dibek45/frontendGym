import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from './local-encrypted-storage.service';
import { UpdateVersionService } from './update-version.service';
import { SyncServiceDispatcher } from './sync-service-dispatcher.service';

import { SocketService } from '../../login/socket.service';
import { Casher } from '../../state/point-of-sale/casher/cashier.model';

import {  CashRegister } from '../../state/point-of-sale/cash-register/cash-register.model';
import { MemberModel } from '../../core/models/member.interface';
import { ProductModel } from '../../core/models/product.interface';
import { ExpenseModel } from '../../home/point-of-sale/expenses/expenses.component';
import { Routine } from '../../state/point-of-sale/routines/routines.model';
import { MachineModel } from '../../state/machine/machine.model';

import { CashRegisterActions } from '../../state/point-of-sale/cash-register/cash-register.actions';
import * as CasherActions from '../../state/point-of-sale/casher/cashier.actions';
import * as ProductActions from '../../state/product/product.actions';
import { Sale } from '../../state/point-of-sale/sale/sale.model';
import { loadSalesSuccess } from '../../state/point-of-sale/sale/sale.actions';

import * as RoutineActions from '../../state/point-of-sale/routines/routines.actions';
import * as MachineActions from '../../state/machine/machine.actions';

import { loadedMembers } from '../../state/member/member.actions';
import { setCajaState } from 'src/app/state/user/session/user-session.actions';

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

      this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess
({ cashRegisters: updatedList }));
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







private subscribeToSaleUpdates() {
  this.socketService.saleUpdated$.subscribe({
    next: async (updated: Sale) => {
      console.log('📨 Venta actualizada recibida por socket:', updated);

      const identity = await this.localStorage.loadIdentity();
      if (!identity) return;

      const { userId, gymId } = identity;
      const list = await this.localStorage.loadTableFromLocalCache<Sale>(userId, gymId, 'sales') || [];
      const updatedList = [...list.filter(s => s.id !== updated.id), updated];

      const enrichedList = updatedList.map(s => ({
        ...s,
        updatedAt: s.updatedAt ?? new Date().toISOString()
      }));

      await this.localStorage.saveTableToLocalCache(userId, gymId, 'sales', enrichedList);
      await this.localStorage.saveVersion(userId, gymId, 'sales', updated.updatedAt?.toString() || new Date().toISOString());

this.store.dispatch(loadSalesSuccess({ sales: updatedList }));
      console.log('✅ Venta actualizada localmente y en Redux');
    }
  });
}


private subscribeToCasherUpdates() {
  this.socketService.casherUpdated$.subscribe(async (updated: Casher) => {
    console.log('📨 Cajero actualizado recibido por socket:', updated);
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const userId = identity.userId;
    const gymId = identity.gymId;

    const list = await this.localStorage.loadTableFromLocalCache<Casher>(userId, gymId, 'cashers') || [];
    const updatedList = [...list.filter(c => c.id !== updated.id), updated];

    const enrichedList = updatedList.map(c => ({
      ...c,
      updatedAt: c.updatedAt ?? new Date().toISOString()
    }));

    await this.localStorage.saveTableToLocalCache(userId, gymId, 'cashers', enrichedList);
    await this.localStorage.saveVersion(userId, gymId, 'cashers', updated.updatedAt?.toString() || new Date().toISOString());

this.store.dispatch(CasherActions.loadCashiersSuccess({ cashiers: updatedList }));
//                                                           ✅ nombre correcto
    console.log('✅ Cajero actualizado localmente y en Redux');
  });
}
private subscribeToRoutineUpdates() {
  this.socketService.routineUpdated$.subscribe(async (updated: Routine) => {
    console.log('📨 Rutina actualizada recibida por socket:', updated);
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const userId = identity.userId;
    const gymId = identity.gymId;

    const list = await this.localStorage.loadTableFromLocalCache<Routine>(userId, gymId, 'routines') || [];
    const updatedList = [...list.filter(r => r.id !== updated.id), updated];

   const enrichedList = updatedList.map(r => ({
  ...r,
  updatedAt: r.updatedAt?.toString() ?? new Date().toISOString()
}));


    await this.localStorage.saveTableToLocalCache(userId, gymId, 'routines', enrichedList);
    await this.localStorage.saveVersion(userId, gymId, 'routines', updated.updatedAt?.toString() || new Date().toISOString());

this.store.dispatch(RoutineActions.loadRoutinesSuccess({ routines: updatedList }));
    console.log('✅ Rutina actualizada localmente y en Redux');
  });
}
private subscribeToMachineUpdates() {
  this.socketService.machineUpdated$.subscribe(async (updated: MachineModel) => {
    console.log('📨 Máquina actualizada recibida por socket:', updated);
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const userId = identity.userId;
    const gymId = identity.gymId;

    const list = await this.localStorage.loadTableFromLocalCache<MachineModel>(userId, gymId, 'machines') || [];
    const updatedList = [...list.filter(m => m.id !== updated.id), updated];

    const enrichedList = updatedList.map(m => ({
      ...m,
      updatedAt: m.updatedAt ?? new Date().toISOString()
    }));

    await this.localStorage.saveTableToLocalCache(userId, gymId, 'machines', enrichedList);
    await this.localStorage.saveVersion(userId, gymId, 'machines', updated.updatedAt?.toString() || new Date().toISOString());

this.store.dispatch(MachineActions.loadMachinesSuccess({ machines: updatedList }));
    console.log('✅ Máquina actualizada localmente y en Redux');
  });
}










  // 🔄 Verifica si se necesita sincronizar una tabla
async syncTableIfNeeded(table: string): Promise<void> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const versionMap = await this.updateVersionService.getVersionMapByGym(identity.gymId);
  const remoteUpdatedAt = versionMap.get(table);
  if (!remoteUpdatedAt) return;

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

    if (table === 'cashRegisters') {
      console.log('📦 Intentando actualizar caja desde SyncService post-dispatch');

      const cajas = await this.localStorage.loadTableFromLocalCache<CashRegister>(
        identity.userId,
        identity.gymId,
        'cashRegisters'
      ) || [];

      const cajaAbierta = cajas.find(c => c.status === 'open');
      const currentBalance = cajaAbierta?.currentBalance || 0;
      const cajaStatus = cajaAbierta ? 'open' : 'closed';

      console.log('🔁 Caja encontrada:', cajaAbierta);
      console.log('🟢 Balance a despachar:', currentBalance, 'Estado:', cajaStatus);

      this.store.dispatch(setCajaState({ currentBalance, cajaStatus }));
    }
  } else {
    console.log(`✅ ${table} está actualizado.`);
  }
}


  // 🔁 Ejecutar sync al iniciar la app
  async syncAllTablesOnStartup(): Promise<void> {
    await this.syncTableIfNeeded('cashRegisters');
    await this.syncTableIfNeeded('members');
    await this.syncTableIfNeeded('products');
    await this.syncTableIfNeeded('expenses');
    await this.syncTableIfNeeded('sale');
    await this.syncTableIfNeeded('routine');
    await this.syncTableIfNeeded('machine');
    await this.syncTableIfNeeded('cashiers');


  }
}
