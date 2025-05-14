export interface ProductModel {
  id: number;
  name: string;
  created_at?: string;
  available: boolean;
  img: string;
  stock: number;
  price: number;
  categoriaId?: string;
  barcode?: string;
  gymId?: number;
  isMembership?: boolean;          // ✅ Ya incluido
  idClienteTOMembership?: number;  // ✅ Ya incluido

  // 🔄 Campos de sincronización
  updatedAt?: string;              // Última vez actualizado
  isSynced?: boolean;              // true si ya se sincronizó con backend
  syncError?: boolean;             // true si hubo error al sincronizar
  tempId?: string;                 // ID temporal antes de obtener el ID real
}
