import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { SmartSearchComponent } from '../search/smart-search/smart-search.component';

import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { SocketService } from 'src/app/login/socket.service';
import { CashRegisterSyncService } from 'src/app/local/tables-sync/cash-register-sync.service';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {
  showMenu: boolean = false;
  currentBalance: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private localStorage: LocalEncryptedStorageService,
    private socketService: SocketService,
    private cashRegisterSyncService: CashRegisterSyncService
  ) {}

  ngOnInit(): void {
    this.traerCaja();
    this.listenToCashRegisterUpdates();
  }

  traerCaja() {
    this.localStorage.loadIdentity().then(identity => {
      if (!identity) return;

      const { userId, gymId } = identity;

      this.localStorage
        .loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters')
        .then(cajas => {
          const cajaAbierta = (cajas || []).find(c => c.status === 'open');
          this.currentBalance = cajaAbierta?.currentBalance || 0;
        });
    });
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

      this.currentBalance =
        updatedList.find(c => c.status === 'open')?.currentBalance || 0;
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
