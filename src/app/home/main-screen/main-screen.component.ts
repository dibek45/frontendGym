import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { gql } from '@apollo/client/core';
import { SyncService } from 'src/app/local/services/sync.service';
import { SocketService } from 'src/app/login/socket.service';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { CashRegisterSyncService } from 'src/app/local/tables-sync/cash-register-sync.service';
import { MemberSyncService } from 'src/app/local/tables-sync/member-sync.service';
import { ProductSyncService } from 'src/app/local/tables-sync/product-sync.service';
import { CashierSyncService } from 'src/app/local/tables-sync/cashier-sync.service';
import { Store } from '@ngrx/store';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { CashRegisterService } from 'src/app/state/point-of-sale/cash-register/cash-register.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SmartSearchComponent } from 'src/app/shared/search/smart-search/smart-search.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MemberService } from 'src/app/state/member/member.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SpeechService } from 'src/app/shared/speech.service';
import { map, Observable, of } from 'rxjs';
import { selectAllProducts } from 'src/app/state/product/product.selectors';
import { ProductModel } from 'src/app/core/models/product.interface';
import { CartService } from 'src/app/state/point-of-sale/cart/cart.service';
import { loadedProducts, loadProducts, setDetailProduct } from 'src/app/state/product/product.actions';
import { ProductService } from 'src/app/state/product/product.service';
import { CartItemModel } from '../product/cart/cart-item.model';
import { PlanModalComponent } from 'src/app/shared/card/plan-modal/plan-modal.component';
import { loadPlansByGym } from 'src/app/state/plan/plan.actions';
import { selectPlansByGymId } from 'src/app/state/plan/plan.selectors';
import { setCajaState, setUserSession } from 'src/app/state/user/session/user-session.actions';

const CASH_REGISTER_SUBSCRIPTION = gql`
  subscription Subscription($gymId: Int!) {
    cashRegisterUpdated(gymId: $gymId) {
      id
    }
  }
`;

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule,MatIconModule,HttpClientModule,   CommonModule,
    MatDialogModule,ZXingScannerModule],
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],


})
export class MainScreenComponent {
public gymId: number = 0;
plans$: Observable<any[]> = of([]); // valor inicial vacío

 

  public currentBalance: number = 0;
showScanner: any;
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
scannedId: string = ''; 
  timeout: any; 
  manualNumber: string | null = "";
  modalOpened: boolean | undefined;
  plans: any;

  constructor(private router: Router, private syncService:SyncService,   
     private socketService: SocketService,
        private localStorage: LocalEncryptedStorageService,
       private cashRegisterSyncService: CashRegisterSyncService,
       private memberSyncService:MemberSyncService,
       private productSyncService:ProductSyncService,
       private cashierSyncService: CashierSyncService,
       private store:Store,
       private cashRegisterService:CashRegisterService,
       private dialog: MatDialog,
      private _access:MemberService,
          private _notification:NotificationService,
    private speechService: SpeechService,
         private cartService: CartService,
               private productService: ProductService,
  ) {
    
 
  }

 @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLElement;

    // Evitar que se procese si el foco está en un input o textarea
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      return;
    }

    this.captureScannedData(event);
  }
async ngOnInit(): Promise<void> {
  this.socketService.joinGymRoom(1);
  this.listenToCashRegisterUpdates();
  this.listenProductUpdates();
  this.listenToCashRegisterDeletes();
  this.listenUserUpdates();
  this.syncService.syncAllTablesOnStartup();

  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const { userId, gymId, username, role, gymName } = identity;

  this.gymId = gymId;

  // ✅ Despachar datos de sesión del usuario
  this.store.dispatch(setUserSession({
    userId,
    userName: username,
    gymId,
    gymName: gymName || 'Gym',
    role: role || 'usuario'
  }));

  // Planes
  this.plans$ = this.store.select(selectPlansByGymId(this.gymId));
  this.plans$.subscribe(plans => {
    this.plans = plans;
    console.log('🧾 Planes actualizados desde el store:', this.plans);
  });

  // ✅ Cajas
  const cajas = await this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters') || [];
  const cajaAbierta = cajas.find(c => c.status === 'open');
  const currentBalance = cajaAbierta?.currentBalance || 0;
  const cajaStatus = cajaAbierta ? 'open' : 'closed';

  this.store.dispatch(setCajaState({
    currentBalance,
    cajaStatus
  }));

  this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: cajas }));

  // Productos
  const products = await this.productService.getProductsWithCache();
  this.store.dispatch(loadedProducts({ products }));
  console.log('✅ Productos cargados a Redux desde main:', products);
}



  traerCaja(){
    this.localStorage.loadIdentity().then(identity => {
  if (!identity) return;

  const { userId, gymId } = identity;

  this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters')
    .then(cajas => {
      console.log('📦 Cajas locales cargadas en ngOnInit:', cajas || []);

      const cajaAbierta = (cajas || []).find(c => c.status === 'open');
      this.currentBalance = cajaAbierta?.currentBalance || 0;
    });
});

  }
listenUserUpdates(){
  this.socketService.onMemberUpdate((member) => {
  console.log('📡 Evento recibido: memberUpdated', member);
  this.memberSyncService.handleRemoteUpdate(member); // si ya usas esto
});

}

listenToCashRegisterDeletes() {
  this.socketService.onCashRegisterDeleted((payload) => {
    console.log('🗑️ Evento recibido: cashRegisterDeleted', payload);
    this.cashRegisterSyncService.removeFromLocal(payload.id);
  });
}
  async captureScannedData(event: KeyboardEvent) {
    clearTimeout(this.timeout); // Reinicia el temporizador

    if (event.key === 'Enter') {
      // Si la tecla es Enter, procesamos directamente
    //  alert(`ID escaneado completo: ${this.scannedId}`);
      try {
        const result = await this.onScanSuccess(this.scannedId);
        if (result) {
          this.manualNumber = '';
        } else {
        }
      } catch (error) {
        console.error('Error en la operación:', error);
      }
      this.processScannedId(this.scannedId);
      this.scannedId = ''; // Reinicia el buffer
    } else {
      // Concatenar caracteres enviados por el escáner
      this.scannedId += event.key;

      // Configura un temporizador para procesar si no hay más teclas
      this.timeout = setTimeout(() => {
       // alert(`ID escaneado por timeout: ${this.scannedId}`);
        this.processScannedId(this.scannedId);
        this.scannedId = ''; // Reinicia el buffer
      }, 100); // Tiempo de espera (ajustable según el escáner)
    }
  }
listenProductUpdates(){
  this.socketService.onProductUpdate((product) => {
  this.productSyncService.handleRemoteUpdate(product);
});
}


listenToCashRegisterUpdates() {
  this.socketService.onCashRegisterUpdate(async (updatedCashRegister) => {
    console.log('📡 Evento recibido: cashRegisterUpdated', updatedCashRegister);

    // Sincroniza y guarda en caché
    await this.cashRegisterSyncService.handleRemoteUpdate(updatedCashRegister);

    // Carga el caché actualizado
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const { userId, gymId } = identity;

    const updatedList = await this.localStorage.loadTableFromLocalCache<CashRegister>(
      userId,
      gymId,
      'cashRegisters'
    ) || [];

    // ✅ Muestra en consola las cajas locales
    console.log("777777777777777777777777777777777777");
    console.log('📦 Cajas locales desde caché:', updatedList);
this.currentBalance = updatedList.find(c => c.status === 'open')?.currentBalance || 0;

    // Actualiza el store de Redux
    this.store.dispatch(
      CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: updatedList })
    );

    console.log('✅ Cajas locales actualizadas en Redux después de socket');
  });
}



listenCashierUpdates() {
  this.socketService.onCashierUpdate((cashier) => {
    this.cashierSyncService.handleRemoteUpdate(cashier);
  });
}
  route(route:string){
    this.router.navigate([route]);
  }

abrirRenovacion() {
  if (!this.gymId) {
    console.warn('❌ gymId no disponible');
    return;
  }

  this.store.dispatch(loadPlansByGym({ gymId: this.gymId }));

  this.dialog.open(SmartSearchComponent, {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    panelClass: 'full-screen-dialog',
    data: { modo: 'miembro' }
  }).afterClosed().subscribe((res: any) => {
    if (res && res.__tipo === 'miembro') {
      this.openRenovarModal(res.id);
    }
  });
}




  renovar(membresia: any) {
    console.log('Renovando a:', membresia);
    // lógica de renovación
  }

  abrirBusquedaGeneral(tipo: 'membresia' | 'rutina' | 'nota') {
  const dialogRef = this.dialog.open(SmartSearchComponent, {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    panelClass: 'full-screen-dialog',
    data: { type: tipo }
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      console.log('Seleccionado:', resultado);
      // Aquí haces lo que corresponda según el tipo
    }
  });
}

onScanSuccess(result: any): Promise<boolean> {

  return new Promise((resolve, reject) => {

    
    if (result.toString().length == 13 ||result.toString().length == 12) {


      this.searchProduct(result); 
      this.manualNumber = '';
      this.closeScanner(); // 🔥 Cierra el escáner porque ya se detectó un producto
      resolve(true); // 🔥 Resolver la promesa inmediatamente




    } else {
      const [gymIdStr, userIdStr] = result.split('-');
      const gymId = parseFloat(gymIdStr); // Convertir a número
      const userId = parseFloat(userIdStr); // Convertir a número

      this._access.getUserByCodeQrMovil(result).subscribe({
        next: (data: any) => {
          console.log('Usuario obtenido con éxito:', data);
          this._notification.mostrarSnackbar("Acceso " + data.name, 'success', data.img);
          this.speechService.speak("Acceso " + data.name);
          resolve(true); // 🔥 Resolver la promesa cuando se obtiene el usuario
          this.closeScanner(); // 🔥 Cerrar el escáner después de obtener la respuesta
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
          alert('Error al obtener usuario: ' + error);
          reject(false); // 🔥 Rechazar la promesa si hay error
          this.closeScanner(); // 🔥 Cerrar el escáner después de obtener la respuesta
        }
      });
    }
  });
}

closeScanner() {
  this.showScanner = false;
}

 // Método para buscar un producto por barcode
 searchProduct(barcode: string) {
  if (barcode) {
    alert('Buscando producto con barcode: ' + barcode);

 this.store.select(selectAllProducts as any).pipe(
  map(products => (products as ProductModel[]).find(p => p.barcode === barcode))
    ).subscribe(product => {
      if (product) {
        this.cartService.openAddToCartModal(product);
        this.cartService.actualizarImg();
        this.store.dispatch(setDetailProduct({ product }));
      } else {
        console.log('Producto no encontrado');
      }
    });
  } else {
    console.warn('No se ingresó ningún código de barras');
  }
}


  
processScannedId(id: string) {
    if (id) {
      console.log(`Procesando ID: ${id}`);
      // Aquí puedes validar o enviar el ID al backend
    } else {
      console.log('El ID escaneado está vacío');
    }
  }

  toggleScanner() {
  this.showScanner = !this.showScanner;

}


venderProducto() {
  this.dialog.open(SmartSearchComponent, {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    panelClass: 'full-screen-dialog',
    data: { modo: 'producto' }
  }).afterClosed().subscribe(producto => {
    if (producto) {
      this.cartService.openAddToCartModal(producto);
      this.store.dispatch(setDetailProduct({ product: producto }));
    }
  });
}


openRenovarModal(userId: string): void {
  if (this.modalOpened) return;

  // ✅ Verifica si hay planes antes de abrir el modal
  if (!this.plans || this.plans.length === 0) {
    console.warn('❗ No hay planes disponibles para mostrar en el modal.');
    return;
  }

  // ✅ Abre el modal con los planes que te pasan por @Input()
  const dialogRef = this.dialog.open(PlanModalComponent, {
    width: '400px',
    disableClose: true,
    data: {
      plans: this.plans, // <-- Usa el input
      userId: userId
    }
  });

  this.modalOpened = true;

  dialogRef.afterClosed().subscribe(result => {
    this.modalOpened = false;

    if (result) {
      console.log('✅ Plan seleccionado en el modal:', result);

      const membership: CartItemModel = {
        product: {
          id: Number(result.id),
          name: result.name,
          price: result.price,
          img: 'assets/membership.png',
          available: true,
          stock: 9999,
          isMembership: true,
          idClienteTOMembership: userId ? Number(userId) : 0 // 🔥 Si `userId` es `null`, se envía `0`
        },
        quantity: 1,
        total: result.price
      };

      console.log('📌 Agregando membresía al carrito:', membership);

      this.cartService.addItem(membership.product, membership.quantity);
    }
  });
}

}