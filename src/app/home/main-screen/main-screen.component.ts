import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, of, map, take, filter } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';

import { SmartSearchComponent } from 'src/app/shared/search/smart-search/smart-search.component';
import { PlanModalComponent } from 'src/app/shared/card/plan-modal/plan-modal.component';
import { CartService } from 'src/app/state/point-of-sale/cart/cart.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SpeechService } from 'src/app/shared/speech.service';
import { ProductService } from 'src/app/state/product/product.service';
import { MemberService } from 'src/app/state/member/member.service';
import { Store } from '@ngrx/store';

import { loadPlansByGym } from 'src/app/state/plan/plan.actions';
import { selectPlansByGymId } from 'src/app/state/plan/plan.selectors';
import { selectAllProducts } from 'src/app/state/product/product.selectors';
import { loadedProducts, setDetailProduct } from 'src/app/state/product/product.actions';
import { CartItemModel } from '../product/cart/cart-item.model';
import { ProductModel } from 'src/app/core/models/product.interface';

import { SocketService } from 'src/app/login/socket.service';
import { SyncService } from 'src/app/local/services/sync.service';
import { CashRegisterSyncService } from 'src/app/local/tables-sync/cash-register-sync.service';
import { MemberSyncService } from 'src/app/local/tables-sync/member-sync.service';
import { ProductSyncService } from 'src/app/local/tables-sync/product-sync.service';
import { CashierSyncService } from 'src/app/local/tables-sync/cashier-sync.service';
import { UserInsitService } from 'src/app/local/user-init.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { selectGymId } from 'src/app/state/user/session/user-session.selectors';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { CheckinListComponent } from './components/checkin-list/checkin-list.component';
import { CheckinModalComponent } from './components/checkin-modal/checkin-modal.component';
import { ModalExpenseComponent } from './components/expense/modal/modal-expense.component';


@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
   standalone: true,
  imports: [CommonModule,MatIconModule,HttpClientModule,   CommonModule,
    MatDialogModule,ZXingScannerModule,  
],
})
export class MainScreenComponent {
  public gymId: number = 0;
  public plans$: Observable<any[]> = of([]);
  public currentBalance: number = 0;
  public showScanner: boolean = false;

  scannedId: string = '';
  timeout: any;
  manualNumber: string | null = '';
  modalOpened: boolean | undefined;
  plans: any;

  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store: Store,
    private _access: MemberService,
    private _notification: NotificationService,
    private speechService: SpeechService,
    private cartService: CartService,
    private productService: ProductService,
    private socketService: SocketService,
    private syncService: SyncService,
    private cashRegisterSyncService: CashRegisterSyncService,
    private memberSyncService: MemberSyncService,
    private productSyncService: ProductSyncService,
    private cashierSyncService: CashierSyncService,
    private userInitService: UserInsitService,
    private localStorage:LocalEncryptedStorageService
  ) {}

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') return;
    this.captureScannedData(event);
  }

  async ngOnInit(): Promise<void> {
    this.socketService.joinGymRoom(1);
    this.listenToCashRegisterUpdates();
    this.listenProductUpdates();
    this.listenToCashRegisterDeletes();
    this.listenUserUpdates();
    this.syncService.syncAllTablesOnStartup();

    await this.userInitService.restoreUserFromSactorage();

const identity = await this.localStorage.loadIdentity();
if (!identity) return;

this.gymId = identity.gymId;

// 🔁 Despachar carga de planes
this.store.dispatch(loadPlansByGym({ gymId: this.gymId }));

// 🔁 Esperar a que lleguen los planes desde el store
this.store.select(selectPlansByGymId(this.gymId))
  .pipe(
    filter(plans => plans && plans.length > 0),
    take(1)
  )
  .subscribe(plans => {
    this.plans = plans;
    console.log('✅ Planes cargados desde identity:', this.plans);
  });






    const products = await this.productService.getProductsWithCache();
    this.store.dispatch(loadedProducts({ products }));
  }

  listenUserUpdates() {
    this.socketService.onMemberUpdate(member => {
      this.memberSyncService.handleRemoteUpdate(member);
    });
  }

  listenToCashRegisterDeletes() {
    this.socketService.onCashRegisterDeleted(payload => {
      this.cashRegisterSyncService.removeFromLocal(payload.id);
    });
  }

  listenToCashRegisterUpdates() {
    this.socketService.onCashRegisterUpdate(async updatedCashRegister => {
      await this.cashRegisterSyncService.handleRemoteUpdate(updatedCashRegister);
      await this.userInitService.restoreUserFromSactorage();
    });
  }

  listenProductUpdates() {
    this.socketService.onProductUpdate(product => {
      this.productSyncService.handleRemoteUpdate(product);
    });
  }

  processScannedId(id: string) {
    if (!id) return;
    console.log(`Procesando ID: ${id}`);
  }

  captureScannedData(event: KeyboardEvent) {
    clearTimeout(this.timeout);
    if (event.key === 'Enter') {
      this.onScanSuccess(this.scannedId);
      this.processScannedId(this.scannedId);
      this.scannedId = '';
    } else {
      this.scannedId += event.key;
      this.timeout = setTimeout(() => {
        this.processScannedId(this.scannedId);
        this.scannedId = '';
      }, 100);
    }
  }

  onScanSuccess(result: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (result.toString().length === 12 || result.toString().length === 13) {
        this.searchProduct(result);
        this.manualNumber = '';
        this.closeScanner();
        return resolve(true);
      }

      const [gymIdStr, userIdStr] = result.split('-');
      const gymId = parseFloat(gymIdStr);
      const userId = parseFloat(userIdStr);

      this._access.getUserByCodeQrMovil(result).subscribe({
        next: (data: any) => {
          this._notification.mostrarSnackbar("Acceso " + data.name, 'success', data.img);
          this.speechService.speak("Acceso " + data.name);
          this.closeScanner();
          resolve(true);
        },
        error: (error) => {
          alert('Error al obtener usuario');
          this.closeScanner();
          reject(false);
        }
      });
    });
  }

  searchProduct(barcode: string) {
    this.store.select(selectAllProducts as any).pipe(
      map(products => (products as ProductModel[]).find(p => p.barcode === barcode))
    ).subscribe(product => {
      if (product) {
        this.cartService.openAddToCartModal(product);
        this.cartService.actualizarImg();
        this.store.dispatch(setDetailProduct({ product }));
      }
    });
  }

  closeScanner() {
    this.showScanner = false;
  }

  toggleScanner() {
    this.showScanner = !this.showScanner;
  }

  route(route: string) {
    this.router.navigate([route]);
  }

  abrirRenovacion() {
    this.dialog.open(SmartSearchComponent, {
       panelClass: 'full-screen-dialog', // 👈 este nombre es importante
  width: '100vw',
  height: '100vh',
  maxWidth: '100vw',
  disableClose: true,
      data: { modo: 'miembro' }
    }).afterClosed().subscribe((res: any) => {
      if (res?.__tipo === 'miembro'){
         this.openRenovarModal(res.id);


      }
    });
  }

  openRenovarModal(userId: string): void {
    if ( !this.plans?.length) {
      alert("return")
      return
    };
    const dialogRef = this.dialog.open(PlanModalComponent, {
      width: '400px',
      disableClose: true,
      data: {
        plans: this.plans,
        userId
      }
    });

    this.modalOpened = true;
    dialogRef.afterClosed().subscribe(result => {
      this.modalOpened = false;
      if (result) {
        const membership: CartItemModel = {
          product: {
            id: Number(result.id),
            name: result.name,
            price: result.price,
            img: 'assets/membership.png',
            available: true,
            stock: 9999,
            isMembership: true,
            idClienteTOMembership: Number(userId)
          },
          quantity: 1,
          total: result.price
        };
        this.cartService.addItem(membership.product, membership.quantity);
      }
    });
  }

  venderProducto() {
  this.dialog.open(SmartSearchComponent, {
    panelClass: 'full-screen-dialog',
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    disableClose: true,
    data: { modo: 'producto' }
  }).afterClosed().subscribe((producto: ProductModel | undefined) => {
    if (producto) {
      console.log('🛒 Abriendo modal para producto:', producto);
      this.cartService.openAddToCartModal(producto);
      this.store.dispatch(setDetailProduct({ product: producto }));
    }
  });
}


  abrirBusquedaGeneral(tipo: 'membresia' | 'rutina' | 'nota') {
    const dialogRef = this.dialog.open(SmartSearchComponent, {
      width: '100vw',
      height: '100vh',
      panelClass: 'full-screen-dialog',
      data: { type: tipo }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        console.log('Seleccionado:', resultado);
      }
    });
  }

  renovar(membresia: any) {
    console.log('Renovando a:', membresia);
  }

  openCheckinModal() {
this.dialog.open(CheckinModalComponent, {
  width: '100vw',
  height: '100vh',
  maxWidth: '100vw',
  panelClass: 'full-screen-modal'
});

}

openModalExpense() {
this.dialog.open(ModalExpenseComponent, {
  width: '420px',
  panelClass: 'expense-dialog'
});

  
}

}