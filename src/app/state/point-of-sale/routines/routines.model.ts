// Representa una rutina
export interface Routine {
  id: number; // Unique ID for the routine
  name: string; // Name of the routine (e.g., Pull-ups, Squats)
  description: string; // Detailed description of the routine
  link: string; // URL to a video or reference for the routine
  path:string;
  count: number; // Counter for tracking routine usage
  exerciseTypeId: number; // ID of the associated exercise type
  createdAt: Date; // Timestamp for when the routine was created
  updatedAt: Date; // Timestamp for when the routine was last updated
  img?:string

  
  // 🔄 Campos de sincronización
  isSynced?: boolean;              // true si ya se sincronizó con backend
  syncError?: boolean;             // true si hubo error al sincronizar
  tempId?: string;                 // ID temporal antes de obtener el ID real
}


// Representa un gimnasio (si es necesario en alguna parte del estado)
export interface Gym {
  id: number; // ID único del gimnasio
  name: string; // Nombre del gimnasio
}


export interface ExerciseType {
  id: number; // Unique ID for the exercise type
  name: string; // Name of the exercise type (e.g., Back, Biceps)
  gymId: number; // Gym ID to which the exercise type belongs
  routines?: Routine[]; // List of routines associated with this exercise type
}
