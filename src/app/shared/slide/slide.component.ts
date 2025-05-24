import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { SmartSearchComponent } from '../search/smart-search/smart-search.component';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { SocketService } from 'src/app/login/socket.service';
import { CashRegisterSyncService } from 'src/app/local/tables-sync/cash-register-sync.service';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable } from 'rxjs';
import { selectCurrentBalance, selectUserSessionState } from 'src/app/state/user/session/user-session.selectors';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { setCajaState } from 'src/app/state/user/session/user-session.actions';
// si usas el servicio extra

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
    private store: Store
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
      const currentBalance = cajaAbierta?.currentBalance || 0;
      const cajaStatus = cajaAbierta ? 'open' : 'closed';

      this.store.dispatch(
        setCajaState({ currentBalance, cajaStatus }) // asegúrate de importar esto
      );
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
}
