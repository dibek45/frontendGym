import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { SmartSearchComponent } from '../search/smart-search/smart-search.component';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { SocketService } from 'src/app/login/socket.service';
import { CashRegisterSyncService } from 'src/app/local/tables-sync/cash-register-sync.service';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, map, Observable, take } from 'rxjs';
import { selectAllExpenses, selectCurrentBalance, selectUserSessionState } from 'src/app/state/user/session/user-session.selectors';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { setCajaState } from 'src/app/state/user/session/user-session.actions';
// si usas el servicio extra
import { ChangeDetectorRef } from '@angular/core';
import { CajaMovimientosModalComponent } from 'src/app/home/main-screen/components/btn-caja-detalles-click/caja-movimientos-modal-component/caja-movimientos-modal-component.component';
import { ExpenseModel } from 'src/app/state/expense/expense.model';
import { SaleModel } from 'src/app/state/point-of-sale/cash-register/sale.model';
import { AppState } from 'src/app/state/app.state';
import { selectAllSales, selectSalesState } from 'src/app/state/point-of-sale/sale/sale.selectors';
import { Sale } from 'src/app/state/point-of-sale/sale/sale.model';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { selectAllCashRegisters } from 'src/app/state/point-of-sale/cash-register/cash-register.selectors';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {
  showMenu: boolean = false;
  public currentBalance$: Observable<number> | undefined; // observable desde el store

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private localStorage: LocalEncryptedStorageService,
    private socketService: SocketService,
    private cashRegisterSyncService: CashRegisterSyncService,
  private store: Store<AppState>,
      private cdr: ChangeDetectorRef // 👈 agrega esto

  ) {}

  ngOnInit(): void {
this.currentBalance$ = this.store.select(selectCurrentBalance).pipe(
  distinctUntilChanged()
);


  this.store.select(selectUserSessionState).subscribe(state => {
    console.log('📦 Estado userSession:', state);
  });

  this.cargarDesdeLocalSiExiste();
this.sincronizarCajaDesdeCashRegisters()

  this.socketService.onCashRegisterUpdate(async (updatedCashRegister) => {
    console.log('📡 Recibido cashRegisterUpdated', updatedCashRegister);

    await this.cashRegisterSyncService.handleRemoteUpdate(updatedCashRegister);

    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const data = await this.localStorage.loadTableFromLocalCache<CashRegister>(
      identity.userId,
      identity.gymId,
      'cashRegisters'
    );

    // 🧠 Buscar caja del cajero actual (usuario logueado) y abierta
    const caja = data?.find(c =>
      c.cashier?.userId === identity.userId && c.status?.toLowerCase() === 'open'
    );

    if (caja) {
      this.store.dispatch(setCajaState({
        currentBalance: caja.currentBalance ?? 0,
        cajaStatus: 'open',
        cashRegisterId: caja.id ?? 0,
      }));
      alert(`💵 Caja actualizada vía socket: $${caja.currentBalance}`);
    }
  });
}
private sincronizarCajaDesdeCashRegisters() {
  combineLatest([
    this.store.select(selectAllCashRegisters),
    this.store.select(selectUserSessionState)
  ])
  .pipe(distinctUntilChanged())
  .subscribe(([cashRegisters, session]) => {
    const userId = session.userId;
    if (!userId || !session.gymId) return;

    const caja = cashRegisters.find(c => c.cashierId === userId && c.status === 'open');

    if (caja) {
      this.store.dispatch(setCajaState({
        currentBalance: caja.currentBalance ?? 0,
        cajaStatus: 'open',
        cashRegisterId: caja.id ?? 0
      }));
      alert(`💰 Caja actualizada: $${caja.currentBalance}`);
    } else {
      this.store.dispatch(setCajaState({
        currentBalance: 0,
        cajaStatus: 'closed',
        cashRegisterId: 0
      }));
    }
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

    // 🔍 Buscar caja del cajero actual (userId) y abierta
    const cajaDelCajero = data.find(caja => caja.cashier?.userId === identity.userId && caja.status?.toLowerCase() === 'open');

    if (cajaDelCajero) {
      const currentBalance = cajaDelCajero.currentBalance ?? 0;
      const cashRegisterId = cajaDelCajero.id ?? 0;
      const cajaStatus = 'open'; // ya la validamos

      this.store.dispatch(setCajaState({ currentBalance, cashRegisterId, cajaStatus }));
      //alert(`✅ Caja encontrada para cajero: Balance $${currentBalance}`);
    } else {
      const currentBalance = 0;
      const cashRegisterId = 0;
      const cajaStatus = 'closed';

      this.store.dispatch(setCajaState({ currentBalance, cashRegisterId, cajaStatus }));
      alert('⚠️ No hay caja abierta asignada al cajero.');
    }
  }
}




  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  exit() {
    this.logout();
    this.router.navigate(['login']);
  }

  logout(): void {
    console.log('logout');
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
  }

  settings(): void {
    this.showMenu = false;
    this.router.navigate(['home/camera-video']);
  }

  route(route: string) {
    this.router.navigate([route]);
  }

  abrirBusqueda() {
    this.dialog.open(SmartSearchComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100vh',
      panelClass: 'full-screen-modal',
      data: { modo: 'general' },
      autoFocus: false
    });
  }


abrirMovimientosCaja() {



  this.store.select(selectSalesState).pipe(take(1)).subscribe(state => {
  console.log('🔎 Estado completo de ventas:', state);
});




  this.store.select(selectUserSessionState).pipe(take(1)).subscribe(session => {
    const cashRegisterId = session.cashRegisterId;
    if (!cashRegisterId) return;

    combineLatest([
      this.store.select(selectAllExpenses),
      this.store.select(selectAllSales).pipe(
        map(ventas => ventas as unknown as SaleModel[]) // 👈 cast for compatibility
      )
    ])
    .pipe(take(1))
    .subscribe(([gastos, ventas]: [ExpenseModel[], SaleModel[]]) => {

      console.log('🔍 Caja ID actual:', cashRegisterId);
      console.log('🧾 Gastos en total:', gastos.length, gastos);
      console.log('💰 Ventas en total:', ventas.length, ventas);

   const movimientos = [
  ...gastos
    .filter(g => g.cashRegisterId === cashRegisterId)
    .map(g => ({
      tipo: 'gasto',
      amount: g.amount,
      descripcion: g.description || '',
      fecha: new Date(g.expenseDate)
    })),
  ...ventas
    .filter(v => v.cashRegister?.id === cashRegisterId || v.cashRegisterId === cashRegisterId)
    .map(v => ({
      tipo: 'venta',
      amount: v.totalAmount,
      descripcion: `#${v.id}`,
fecha: v.saleDate ? new Date(v.saleDate) : new Date()
    }))
];

// 🔽 Ordenar todos por fecha descendente (más reciente primero)
const ordenados = movimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());


      this.dialog.open(CajaMovimientosModalComponent, {
        width: '90vw',
        maxWidth: '600px',
        data: { movimientos: ordenados },
        position: {
          top: '130px' // 🔼 para que no quede tan centrado
        }
      });
    });
  });
}


}
