export interface QRModel {
    id?: number;           // ID del QR (opcional porque puede ser nuevo en local)
    code: string;     
    name:string     // Código del QR
    machineId?: number;     // ID de la máquina a la que pertenece (opcional si es nuevo)
  }
  
  export interface MachineModel {
    id?: number;           // ID de la máquina (opcional porque puede ser temporal en local)
    name: string;          // Nombre de la máquina
    gymId: number;         // ID del gym al que pertenece
    qrs?: QRModel[];       // Lista de QRs (0 a 4)
    description:string;
    // Campos adicionales si quieres offline sync control:
    isSynced?: boolean;    // true si ya se sincronizó con backend
    tempId?: string;       // ID temporal para sincronización local
    syncError?: boolean;   // true si hubo error al sincronizar con backend
  }
   