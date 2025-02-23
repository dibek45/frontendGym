import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProductFormService {
  constructor() {}

  productList: any;

  // Definición del formulario para productos
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required), // Nombre del producto
    price: new FormControl(0, [Validators.required, Validators.min(0)]), // Precio del producto
    stock: new FormControl(0, [Validators.required, Validators.min(0)]), // Stock disponible
    categoriaId: new FormControl(null, Validators.required), // ID de la categoría
    available: new FormControl(true), // Disponibilidad del producto
    img: new FormControl('', Validators.required), // Imagen (URL/Base64)
    gymId: new FormControl(null, Validators.required), // ID del gimnasio
    created_at: new FormControl(new Date().toISOString()), // Fecha de creación (automática)
  });

  // Inicialización del formulario con valores predeterminados
  initializeFormGroup() {
    this.form.setValue({
      id: null,
      name: '',
      price: 0,
      stock: 0,
      categoriaId: null,
      available: true,
      img: '',
      gymId: null,
      created_at: new Date().toISOString(),
    });
  }

  // Método para obtener la lista de productos
  getProducts() {
    // Implementa aquí la lógica para obtener productos (por ejemplo, una llamada a tu backend)
  }

  // Método para insertar un nuevo producto
  insertProduct(product: any) {
    // Implementa aquí la lógica para insertar un producto en tu backend
  }

  // Método para actualizar un producto existente
  updateProduct(product: any) {
    // Implementa aquí la lógica para actualizar un producto en tu backend
  }

  // Método para eliminar un producto por ID
  deleteProduct(id: string) {
    // Implementa aquí la lógica para eliminar un producto en tu backend
  }
}
