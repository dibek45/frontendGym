export interface Casher {
  id?: number;       // Identificador único del cajero (opcional)
  name: string;      // Nombre del cajero
  username: string;  // Nombre de usuario
  phone: string;     // Teléfono del cajero
  password: string;  // Contraseña
  gymId: number;     // Identificador del gimnasio

    updatedAt?: string; // 👈 Agrega esto

   // 🔄 Campos de sincronización
  isSynced?: boolean;              // true si ya se sincronizó con backend
  syncError?: boolean;             // true si hubo error al sincronizar
  tempId?: string;                 // ID temporal antes de obtener el ID real
}
