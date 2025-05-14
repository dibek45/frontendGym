export interface MemberModel {
  id: string;
  name: string;
  username: string;
  actived: boolean;
  available_days: number;
  createdAt: string;
  updatedAt?: string;          // ✅ opcional pero útil
  img?: string;
  huella?: string;
  gymId: number;

  // Campos de sincronización:
  isSynced?: boolean;
  syncError?: boolean;
  tempId?: string;
}
