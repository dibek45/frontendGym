import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, firstValueFrom, map, of, throwError } from 'rxjs';
import { ProductModel } from 'src/app/core/models/product.interface';
import { FileConverter } from 'src/app/shared/converter';
import { environment } from 'src/environment.prod';
import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private graphqlEndpoint = environment.apiUrl
   // Reemplaza con tu endpoint GraphQL

  constructor(private http: HttpClient) { 
  }

 
  img2:string=""



 /**
   * Crear un nuevo producto
   * @param product Objeto del producto a crear
   * @returns Observable del producto creado
   */
 createProduct(product: ProductModel): Observable<ProductModel> {
  const mutation = `
    mutation Mutation($createProduct: CreateProduct!) {
  createProduct(createProduct: $createProduct) {
        id
        name
        created_at
        available
        img
        stock
        price
        categoryId
        gymId
        barcode
      }
    }
  `;

  // 1️⃣ Elimina la propiedad id del producto
  const { id, ...productWithoutId } = product;
  console.log('📝 Producto sin ID:', productWithoutId);

  // 2️⃣ Crea el cuerpo JSON de la mutación con la imagen Base64
  const body = {
    query: mutation,
    variables: {
      createProduct: {
        name: productWithoutId.name,
        price: productWithoutId.price,
        stock: productWithoutId.stock,
        available: productWithoutId.available,
        categoryId: productWithoutId.categoriaId,
        gymId: 1,
        barcode: productWithoutId.barcode,
        img: productWithoutId.img // ⚠️ La imagen en Base64 se envía como parte de la variable
      }
    }
  };

  // 3️⃣ Envía la mutación a la API de GraphQL
  return this.http.post<any>(this.graphqlEndpoint, body)
    .pipe(
      map(result => {
        if (!result.data || !result.data.createProduct) {
          throw new Error('Error: No se pudo crear el producto');
        }
        return result.data.createProduct as ProductModel;
      }),
      catchError((error) => {
        console.error('❌ Error en createProduct:', error);
        return throwError(() => error);
      })
    );
}



getData(gymId: number): Observable<ProductModel[]> {
  const query = `query GetAllCategories($gymId: Float!) {
  productsByGymId(gymId: $gymId) {
    id
    name
    created_at
    available
    img
    stock
    price
    categoryId
    gymId
    barcode
  }
}

  `;
  const variables = { gymId };
  return this.http.post<any>(this.graphqlEndpoint, { query, variables })
  .pipe(
    map(result => {
      console.log('Respuesta completa del servidor:', result);
      return result.data.productsByGymId as ProductModel[];
    })
  );

}


async getProductsWithCache(forceBackend = false): Promise<ProductModel[]> {
  const encrypted = await localforage.getItem<string>('identity.json');
  if (!encrypted) {
    console.warn('❌ No hay identity.json');
    return [];
  }

  let identity: any;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    identity = JSON.parse(decrypted);
  } catch (err) {
    console.error('❌ Error al desencriptar identity.json:', err);
    return [];
  }

  const key = `user-${identity.userId}/gym-${identity.gymId}/products`;

  if (!forceBackend) {
    const cached = await localforage.getItem<string>(key);
    if (cached) {
      try {
        const decrypted = CryptoJS.AES.decrypt(cached, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
        const parsed = JSON.parse(decrypted);
        console.log('📂 Productos cargados desde caché local:', parsed);
        return parsed;
      } catch (err) {
        console.error('❌ Error al leer caché de productos:', err);
      }
    }
  }

  try {
    const backendList = await firstValueFrom(this.getData(identity.gymId));
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(backendList), 'clave-super-secreta').toString();
    await localforage.setItem(key, encryptedData);
    console.log('🌐 Productos cargados desde backend:', backendList);
    console.log('💾 Productos guardados en caché local');
    return backendList;
  } catch (err) {
    console.error('❌ Error al obtener productos desde el backend:', err);
    return [];
  }
}
}
