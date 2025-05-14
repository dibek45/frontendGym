import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductModel } from 'src/app/core/models/product.interface';
import * as ProductActions from 'src/app/state/product/product.actions';
import { LocalEncryptedStorageService } from '../services/local-encrypted-storage.service';

@Injectable({ providedIn: 'root' })
export class ProductSyncService {
  private tableName = 'products';

  constructor(
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async handleRemoteUpdate(updatedProduct: ProductModel): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      console.warn('❌ No hay identidad local');
      return;
    }

    const products = await this.localStorage.loadTableFromLocalCache<ProductModel>(
      identity.userId,
      identity.gymId,
      this.tableName
    ) ?? [];

    const index = products.findIndex(p => String(p.id) === String(updatedProduct.id));
    if (index >= 0) {
      products[index] = { ...products[index], ...updatedProduct };
      console.log(`✏️ Producto actualizado localmente (ID ${updatedProduct.id})`);
    } else {
      products.push(updatedProduct);
      console.log(`🆕 Producto agregado localmente (ID ${updatedProduct.id})`);
    }

    const enrichedProducts = products.map(p => ({
      ...p,
      updatedAt: p.updatedAt ?? new Date().toISOString()
    }));

    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      this.tableName,
      enrichedProducts
    );

    this.store.dispatch(ProductActions.loadedProducts({ products: enrichedProducts }));
  }
}
