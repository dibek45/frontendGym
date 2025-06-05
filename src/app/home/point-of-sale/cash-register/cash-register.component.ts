import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SubareaTituloComponent } from 'src/app/shared/subarea-titulo/subarea-titulo.component';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { Casher, CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { selectAllCashRegisters } from 'src/app/state/point-of-sale/cash-register/cash-register.selectors';
import { loadCashiers } from 'src/app/state/point-of-sale/casher/cashier.actions';
import { selectAllCashiers } from 'src/app/state/point-of-sale/casher/cashier.selectors';
import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { CommonModule } from '@angular/common';
import { AddCasherComponent } from '../casher/shared/add-casher/add-casher.component';
import { AddCashRegisterComponent } from "./shared/add-cash-register/add-cash-register.component";
import { CardCasherComponent } from '../casher/shared/card-casher/card-casher.component';
import { CardCashregisterComponent } from './shared/card-cash-register-item/card-cash-register-item.component';
import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';
import { CashRegisterService } from 'src/app/state/point-of-sale/cash-register/cash-register.service';
import { CashRegisterSyncService } from 'src/app/local/tables-sync/cash-register-sync.service';
import { FormsModule } from '@angular/forms';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.scss'],
  standalone:true,
  imports: [CommonModule, FormsModule,SearchCreateListComponent, SubareaTituloComponent,  AddCashRegisterComponent]
})
export class CashRegisterComponent {

  // Store data
  cashRegisters$: Observable<CashRegister[]>;
  cashers$: Observable<Casher[]>;
  encryptionKey = 'clave-super-secreta'; // usa la misma clave que en tu servicio

  // Vista tarjetas
  cashRegistersList: CashRegister[] = [];
  displayedColumns = ['cashierId', 'openingBalance', 'status', 'actions'];
  cardComponent = CardCashregisterComponent;
  idCajaEliminar: number | null = null;

  // Modal y detalles
  isModalOpen = false;
  showDetails = false;
  selectedCashRegister: CashRegister | null = null;
  private destroy$ = new Subject<void>();

  
  constructor(  private localStorage: LocalEncryptedStorageService,
        private router: Router 
,       private store: Store,
  ) {
    this.cashRegisters$ = this.store.select(selectAllCashRegisters);
    this.cashers$ = this.store.select(selectAllCashiers);
  }
ngOnInit(): void {
  this.cargarDesdeLocalSiExiste();

  this.cashRegisters$
    .pipe(takeUntil(this.destroy$))
    .subscribe((list) => {
      this.cashRegistersList = list;
    });
}

private async cargarDesdeLocalSiExiste() {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const data = await this.localStorage.loadTableFromLocalCache<CashRegister>(
    identity.userId,
    identity.gymId,
    'cashRegisters'
  );

  if (data && data.length > 0) {
    console.log('🗂️ Cargando cajas desde localforage al store');
    this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: data }));
  }
}

  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  

 
  loadCashiers(): void {
    this.store.dispatch(loadCashiers());
  }

  // Abrir modal
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleModalClose(event?: {
    action: 'submit';
    data: {
      cashierId: number;
      cashierName: string;
      openingBalance: number;
    };
  }): void {
    if (event?.action === 'submit') {
      const { cashierId, cashierName, openingBalance } = event.data;
      this.addCashRegister(cashierId, cashierName, Number(openingBalance));
    }
    this.closeModal();
  }

  addCashRegister(cashierId: number, cashierName: string, openingBalance: number): void {
    const newCashRegister: CashRegister = {
      cashierId,
      openingBalance,
      gymId: 1,
      updatedAt: Date.now() // ✅ devuelve el número de milisegundos desde 1970
    };
    
    this.store.dispatch(CashRegisterActions.addCashRegister({ cashRegister: newCashRegister }));
  }

  // Acciones de tarjeta
  openDetails(cashRegister: CashRegister): void {
    this.selectedCashRegister = cashRegister;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.selectedCashRegister = null;
    this.showDetails = false;
  }

  onDelete(cashRegister: CashRegister): void {
    console.log('Eliminar caja:', cashRegister);
    // Aquí podrías despachar acción para cerrar o eliminar caja
  }

  async  listarClavesGuardadas() {
    const keys = await localforage.keys();
    console.log('🔍 Claves almacenadas en localForage:', keys);
    alert('Claves guardadas:\n' + keys.join('\n'));
  }
  async mostrarIdentityGuardado() {
    const encrypted = await localforage.getItem<string>('identity.json');
    if (!encrypted) {
      alert('❌ No hay identity.json guardado');
      this.router.navigate(['/login']); // ⬅️ redirección si no hay usuario

      return;
    }

    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const identity = JSON.parse(decrypted);

    console.log('✅ identity.json:', identity);
    alert(`Identity:\nUsuario: ${identity.username}\nGym ID: ${identity.gymId}`);
  }
  async leerArchivo(username: string, gymId: number, tabla: string) {
    const key = `user-${username}/gym-${gymId}/${tabla}`;
    const encrypted = await localforage.getItem<string>(key);
  
    if (!encrypted) {
      alert('❌ No se encontró nada en: ' + key);
      return;
    }
  
    const decryptedBytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
    console.log(`📂 Contenido de ${key}:`, JSON.parse(decrypted));
    alert(`Contenido desencriptado de ${key}:\n` + decrypted);
  }
  async leerArchivoDesdeIdentidad(tabla: string) {
    const encrypted = await localforage.getItem<string>('identity.json');
    if (!encrypted) {
      alert('❌ No hay identity.json');
      return;
    }
  
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const identity = JSON.parse(decrypted);
  
    this.leerArchivo(identity.username, identity.gymId, tabla);
  }
  async limpiarClavesInnecesarias() {
    const claves = await localforage.keys();
  
    const encryptedIdentity = await localforage.getItem<string>('identity.json');
    if (!encryptedIdentity) {
      alert('No se encontró identity.json');
      return;
    }
  
    const bytes = CryptoJS.AES.decrypt(encryptedIdentity, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const identity = JSON.parse(decrypted);
  
    const claveCorrecta = `user-${identity.userId}/gym-${identity.gymId}/cashRegisters`;
  
    const clavesAEliminar = claves.filter(k =>
      k !== 'identity.json' &&
      k !== claveCorrecta &&
      !k.startsWith('cashRegisterState') // opcional, según si quieres eliminarlo
    );
  
    for (const clave of clavesAEliminar) {
      await localforage.removeItem(clave);
      console.log(`🗑️ Clave eliminada: ${clave}`);
    }
  
    alert(`Se eliminaron las claves no necesarias.\nSolo se conservó:\n- identity.json\n- ${claveCorrecta}`);
  }


  async clearLocalCashRegistersHardcore() {
    const encrypted = await localforage.getItem<string>('identity.json');
    if (!encrypted) {
      alert('❌ No hay identity.json guardado');
      return;
    }
  
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const identity = JSON.parse(decrypted);
  
    const clave = `user-${identity.userId}/gym-${identity.gymId}/cashRegisters`;
  
    await localforage.removeItem(clave);
    console.log(`🧨 Eliminado localForage: ${clave}`);
  
    alert('🗑️ Cajas locales eliminadas. La próxima carga será desde el backend.');
  }
  
  async eliminarCajaLocalPorId(id: number | null) {
    if (!id) {
      alert('❌ Ingresa un ID válido');
      return;
    }
  
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      alert('❌ No hay identity.json cargado');
      return;
    }
  
    const list = await this.localStorage.loadTableFromLocalCache<CashRegister>(
      identity.userId,
      identity.gymId,
      'cashRegisters'
    );
  
    if (!list) {
      alert('⚠️ No hay cajas locales');
      return;
    }
  
    const actualizada = list.filter(caja => caja.id !== id);
  
    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      'cashRegisters',
      actualizada
    );
  
    // 👇 Actualizar store manualmente
    this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: actualizada }));
  
    alert(`🗑️ Caja con ID ${id} eliminada de localForage y UI actualizada`);
  }
  
  async borrarCajasYVersion() {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      alert('No hay identity.json');
      return;
    }
  
    await this.localStorage.clearTableAndVersion(identity.userId, identity.gymId, 'cashRegisters');
        await this.localStorage.clearTableAndVersion(identity.userId, identity.gymId, 'members');

    alert('✅ Se borró cashRegisters y su versión. Ahora deberías ver sincronización desde backend.');
  }
  
}