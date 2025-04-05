import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { NotificationService } from 'src/app/shared/notification.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/state/shared/category.model';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { loadCategories } from 'src/app/state/actions/category.actions';
import { AddCategoryModalComponent } from './add-category-modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as CategoryActions from 'src/app/state/actions/category.actions';
import * as ProductActions from 'src/app/state/product/product.actions';
import { ProductModel } from 'src/app/core/models/product.interface';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  isSingleColumnLayout = false; // Variable para controlar el diseño de las columnas

  form: FormGroup; // 🚀 Nueva forma local
  webcamImage: WebcamImage | undefined;
  takePhoto: boolean = true;
  categories$!: Observable<Category[]>;
  loading$!: Observable<boolean>;
  droppedImage: string = ''; // Inicialización con una cadena vacía

  constructor(
    private store: Store<AppState>,
    public notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(1)]),
      stock: new FormControl('', [Validators.required, Validators.min(1)]),
      categoriaId: new FormControl('', Validators.required),
      img: new FormControl('', Validators.required),
      available: new FormControl(true, Validators.required),
      barcode: new FormControl('', Validators.required),
      gymId: new FormControl(1, Validators.required) // GymId por defecto
    });
  }

  ngOnInit() {
    this.checkWindowWidth(); 
    const gymId = 1; // Valor fijo para gymId, puedes personalizarlo
    this.store.dispatch(loadCategories({ gymId }));

    // Suscribirse al estado de la categoría
    this.categories$ = this.store.select((state) => state.categories.categories);
    this.loading$ = this.store.select((state) => state.categories.loading);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth(); // Verificar el ancho de la ventana al cambiar su tamaño
  }

  checkWindowWidth() {
    this.isSingleColumnLayout = window.innerWidth < 768; // Modificar el valor de acuerdo al ancho de la ventana
  }

  onClear() {
    this.form.reset();
    this.notificationService.mostrarSnackbar(':: Formulario reseteado', 'success');
  }

  onSubmit() {
      // Obtener todos los valores del formulario
      const formData = this.form.value;
      const selectedCategoryId = this.form.get('categoriaId')?.value;
      alert('🟢 ID de la categoría seleccionada:'+selectedCategoryId);
      if (selectedCategoryId==null || selectedCategoryId == "") {
        alert("Categoria no seleccionada")
      }else{

     
      // Mostrar los valores actuales del formulario
      console.log('🟢 Datos del formulario:', formData); // ✅ Verifica los valores aquí
  
      // Agregar manualmente los datos que no están en el formulario
        const  createProduct= {
            id:0,
            name: formData.name ?? '', // Valor predeterminado de nombre vacío
            available: formData.available ?? false, // Si no está presente, por defecto false
            img: formData.img ?? 'https://example.com/default-image.jpg', // Imagen predeterminada
            stock: formData.stock ?? 0, // Stock predeterminado (0)
            price: formData.price ?? 0.0, // Precio predeterminado (0.0)
            categoria_id: selectedCategoryId, // Si no hay categoría, se queda null
            gymId: formData.gymId ?? 1, // Valor predeterminado de gymId (en caso de que no se pase)
            barcode: formData.barcode ?? '' // Si no hay código de barras, se queda vacío
          }
        
    
      
  
      // Imprimir los valores que se enviarán
      console.log('🚀 Producto a crear:', createProduct); 
  
      // Despacha la acción de addProduct
      this.store.dispatch(ProductActions.addProduct({ product: createProduct }));
  
      this.notificationService.mostrarSnackbar(':: Producto agregado con éxito', 'success');
      this.onClose()
    }
  }
  

  onClose() {
    this.router.navigate(['home/product/table']);
    this.form.reset();
    this.notificationService.mostrarSnackbar(':: Producto creado con éxito', 'success');
  }

  addItem(value: boolean) {
    this.takePhoto = value;
  }

  getImageTaken(img:string){
    alert(img)
    this.droppedImage=img;
    this.form.controls['img'].setValue(this.droppedImage); // Actualizar el valor del campo img

  }
  onImageDropped(image: string | ArrayBuffer | null | undefined) {
    this.droppedImage = (image as string); 
    this.form.controls['img'].setValue(this.droppedImage); // Actualizar el valor del campo img
  }

  onImageReceived(image: string) {7501058616548

    console.log('Imagen recibida desde PhotoComponent:', image);
    this.droppedImage = image; 
    this.form.controls['img'].setValue(image); // Asigna la imagen al control img
  }

  onBarcodeScanned(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const barcode = inputElement.value;
    console.log('Código escaneado:', barcode);
    if (!/^[0-9]{8,13}$/.test(barcode)) {
      console.error('El código de barras debe tener entre 8 y 13 dígitos.');
      return;
    }
    if (barcode.trim() !== '') {
      console.log('Código válido:', barcode);
      this.form.controls['barcode'].setValue(barcode);
    } else {
      console.error('Por favor, ingresa un código válido.');
    }
  }

  openAddCategoryModal(): void { 
    const dialogRef = this.dialog.open(AddCategoryModalComponent, {
      width: '400px',
      data: {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Nueva categoría agregada:', result);
        
        // Despacha la acción para agregar la categoría
        this.store.dispatch(CategoryActions.addCategory({ 
          category: { 
            name: result.name, 
          }, 
          gymId: 1 
        }));
      }
    });
  }


  preventSubmit(event: any): void {
    event.preventDefault();
  }
}
