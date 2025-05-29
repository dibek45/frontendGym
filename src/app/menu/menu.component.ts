import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { SharedService } from '../shared/login.service';
import { Router } from '@angular/router';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { selectItemsList, selectLoading } from '../state/selectors/huella.selectors';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MemberService } from '../state/member/member.service';
import { NotificationService } from '../shared/notification.service';
import { SpeechService } from '../shared/speech.service';
import { MatDialog } from '@angular/material/dialog';
import { BarcodeFormat } from '@zxing/library';
import { selectCartTotal } from '../state/point-of-sale/cart/cart.selectors';
import { ProductModel } from '../core/models/product.interface';
import { selectAllProducts } from 'src/app/state/product/product.selectors';
import { CartService } from '../state/point-of-sale/cart/cart.service';
import { setDetailProduct } from '../state/product/product.actions';
import { SocketService } from '../login/socket.service';
import { LocalEncryptedStorageService } from '../local/services/local-encrypted-storage.service';
import { CashRegister } from '../state/point-of-sale/cash-register/cash-register.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isLogin: boolean = false;
  loading$: Observable<boolean> = new Observable();
  checking:boolean=true;
  manualNumber: string | null = "";

  cartTotal$: Observable<number> | undefined;  // Observable for the cart total

  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
  total: number=0;
  successSubject: any;
  menuVisible: boolean = false;
  isDesktop: boolean = false;
  menuOpen: boolean = false;
menu: any|null;
barcode: string = ''; // Variable para el código de barras
  product$!: Observable<any | null>; // Observador para el producto encontrado
  error$!: Observable<string | null>; // Observador para mostrar el error

  currentUrl: string = ''; // Aquí se almacenará la URL actual

  constructor(
     private cartService: CartService,
    private authService:AuthService, private store:Store<AppState>,
    private sharedService: SharedService,
    private router: Router,
    private _access:MemberService,
    private _notification:NotificationService,
    private speechService: SpeechService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
    private localStorage: LocalEncryptedStorageService
    
  ) { 
     
  
  }

  selectedIcon: string = 'home';

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    const buttons = document.querySelectorAll('.icon-button');
    buttons.forEach((button) => button.classList.remove('active'));
    document.querySelector(`.icon-button:nth-child(${this.getIconIndex(icon)})`)?.classList.add('active');
  }

  private getIconIndex(icon: string): number {
    const icons = ['home', 'user', 'prouct', 'cart', 'games'];
    return icons.indexOf(icon) + 1;
  }
  ngOnInit(): void {
this.socketService.onCashRegisterUpdate((cashRegister: CashRegister) => {
  alert("Evento recibido: cashRegisterUpdated biiien")
  console.log('📡 Evento recibido: cashRegisterUpdated', cashRegister);
  // 👉 Aquí puedes:
  // - Guardar en localForage
  // - Actualizar Redux
  // - Actualizar update_versions local
});

this.socketmetod();
    this.store.select(selectCartTotal).subscribe(res => {
      this.total = res;
      this.checkScreenSize();
    });
  
    // 🔥 Asegurar que `isLogin` se actualiza correctamente al cambiar de ruta
    this.sharedService.getLoginStatus().subscribe(status => {
      console.log("🔍 Estado de login recibido:", status);
      this.isLogin = status;
  
      // 🔥 Forzar detección de cambios para asegurar que `app-slide` se renderice
      this.cdr.detectChanges();
    });
  
    this.loading$ = this.store.select(selectLoading);
  }
  async socketmetod(){
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      alert('❌ No hay identidad cargada. Cancelando sincronización.');
            this.router.navigate(['/login']); // ⬅️ redirección si no hay usuario

      return;
    }
  
    const userId = identity.userId;
    const gymId = identity.gymId;
    this.socketService.joinGymRoom(gymId);
    this.socketService.onCashRegisterUpdate((data) => {
      alert('📦 Caja recibida globalmente:'+JSON.stringify(data));
    });
  }

  exit(){
    

  }
  
  user(){
    this.router.navigate(['home/user/table']);
  }

  product(){
    this.router.navigate(['home/product/table']);
  }

  cart(){
    this.router.navigate(['home/product/cart']);
  }

  infraestructure(){
    this.router.navigate(['home/product/infraestructue']);
  }

  settings(){
    this.router.navigate(['home/camera-video']);
  }

 


  




  processScannedId(id: string) {
    if (id) {
      console.log(`Procesando ID: ${id}`);
      // Aquí puedes validar o enviar el ID al backend
    } else {
      console.log('El ID escaneado está vacío');
    }
  }


   @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  // Verifica si la pantalla es grande
  private checkScreenSize(): void {
    this.isDesktop = window.innerWidth >= 1024; // Cambia este valor si necesitas otro tamaño
  }

  // Alterna el menú solo si está en escritorio
  toggleMenu() {
    if (this.isDesktop) {
      this.menuVisible = !this.menuVisible;
    }
  }

  closeMenu() {
    this.menuVisible = false;
  }



  

}


