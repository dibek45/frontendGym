export interface MemberModel {
  id: string;               // ID real o temporal
  name: string;
  createdAt: string;
  actived: boolean;
  available_days: number;
  img?: string;
  gymId:number;
  huella?:string;
  username:string;


  // Campos de sincronización:
  isSynced?: boolean;        // true si ya está sincronizado con backend
  syncError?: boolean;       // true si falló el intento de sync
  tempId?: string;           // id temporal antes de tener el id real
}
