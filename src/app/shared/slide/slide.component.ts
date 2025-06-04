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

  this.listenToCashRegisterUpdates();
}


  listenToCashRegisterUpdates() {
    this.socketService.onCashRegisterUpdate(async (updatedCashRegister) => {
      await this.cashRegisterSyncService.handleRemoteUpdate(updatedCashRegister);

      const identity = await this.localStorage.loadIdentity();
      if (!identity) return;

      const { userId, gymId } = identity;

      const updatedList =
        (await this.localStorage.loadTableFromLocalCache<CashRegister>(
          userId,
          gymId,
          'cashRegisters'
        )) || [];
        const cajaAbierta = updatedList.find(c => c.status === 'open');

if (cajaAbierta) {
const currentBalance = cajaAbierta?.currentBalance ?? 0;
  const cajaStatus = 'open';
const cashRegisterId = cajaAbierta?.id ?? 0;

  this.store.dispatch(setCajaState({ currentBalance, cajaStatus, cashRegisterId }));
} else {
  const currentBalance = 0;
  const cajaStatus = 'closed';
  const cashRegisterId = 0; // 👈 usa 0 si tu store no permite null

  this.store.dispatch(setCajaState({ currentBalance, cajaStatus, cashRegisterId }));
}



this.cdr.detectChanges(); // 👈s
    });
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
          .filter(v => v.cashRegister?.id === cashRegisterId)
          .map(v => ({
            tipo: 'venta',
            amount: v.totalAmount,
            descripcion: `Venta #${v.id}`,
            fecha: new Date(v.date)
          }))
      ];

      console.log('📦 Movimientos combinados:', movimientos);

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
