// ✅ Representa una rutina individual
export interface Routine {
  id: number;                      // ID único de la rutina
  name: string;                   // Nombre de la rutina (ej. "Pull-ups", "Sentadillas")
  description: string;            // Descripción detallada de la rutina
  link: string;                   // Enlace a video o referencia de la rutina
  path: string;                   // Ruta del recurso multimedia (imagen/video)
  count: number;                  // Veces que se ha usado la rutina (contador)
  exerciseTypeId: number;         // ID del tipo de ejercicio al que pertenece
  createdAt: Date;                // Fecha de creación
  updatedAt: Date;                // Fecha de última actualización
  img?: string;                   // Imagen opcional (URL o base64)

  // 🔄 Campos de sincronización local/remota
  isSynced?: boolean;             // true si fue sincronizado con el backend
  syncError?: boolean;            // true si hubo un error al sincronizar
  tempId?: string;                // ID temporal mientras se sincroniza
}

// ✅ Representa un gimnasio (si se necesita en algún lugar del estado global)
export interface Gym {
  id: number;                     // ID único del gimnasio
  name: string;                   // Nombre del gimnasio
}

// ✅ Representa un tipo de ejercicio (ej. Pierna, Espalda)
export interface ExerciseType {
  id: number;                     // ID único del tipo de ejercicio
  name: string;                   // Nombre (ej. "Pierna", "Espalda")
  gymId: number;                  // ID del gimnasio al que pertenece
  routines?: Routine[];          // Rutinas asociadas (solo si se cargan con `include`)
}
