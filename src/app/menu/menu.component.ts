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
import { selectCartTotal } from '../state/selectors/cart.selectors';
import { ProductModel } from '../core/models/product.interface';
import { selectAllProducts } from 'src/app/state/selectors/product.selectors';
import { CartService } from '../home/product/cart/cart.service';
import { setDetailProduct } from '../state/actions/product.actions';

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
    private cdr: ChangeDetectorRef
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

 


showScanner = false;

toggleScanner() {
  this.showScanner = !this.showScanner;
  this.menuOpen = !this.menuOpen; // Alterna entre abierto y cerrado

}

closeScanner() {
  this.showScanner = false;
}
 // Método para buscar un producto por barcode
 searchProduct(barcode:string) {

        if (barcode) {

        alert('Buscando producto con barcode:'+barcode);
          this.store.select(selectAllProducts).pipe(
        map(products => products.find((p: ProductModel) => p.barcode === barcode))
      ).subscribe(product => {
        if (product) {
          
          this.cartService.openAddToCartModal(product);
          this.cartService.actualizarImg();
         barcode='';
         this.store.dispatch(setDetailProduct({ product: product })); // Despachar la acción

         
  
  
        } else {
          console.log('Producto no encontrado');
        }
      });
    } else {
      console.warn('No se ingresó ningún código de barras');
    }
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



async onManualNumberChange(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const newValue = inputElement.value; // Obtiene el valor del campo que cambió
  
  try {
    const result = await this.onScanSuccess(newValue); // 🔥 Esperar a que termine antes de limpiar
    if (result) {
      this.manualNumber = '';
    }
  } catch (error) {
    console.error('Error en la operación:', error);
  } 
}

async checar(){
 

}

scannedId: string = ''; 
  timeout: any; 

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLElement;

    // Evitar que se procese si el foco está en un input o textarea
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      return;
    }

    this.captureScannedData(event);
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


