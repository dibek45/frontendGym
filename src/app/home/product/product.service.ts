import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, of, throwError } from 'rxjs';
import { ProductModel } from 'src/app/core/models/product.interface';
import { FileConverter } from 'src/app/shared/converter';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private graphqlEndpoint = 'http://localhost:3000/graphql'; // Reemplaza con tu endpoint GraphQL

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
      map(result => result.data.productsByGymId as ProductModel[])
    );
}
}
