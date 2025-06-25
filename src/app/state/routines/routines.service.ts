import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Routine, ExerciseType } from './routines.model';
import { environment } from 'src/environment.prod';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private graphqlEndpoint = environment.apiUrl; // Replace with your actual GraphQL endpoint

  constructor(private http: HttpClient,    private localStorage: LocalEncryptedStorageService // 👈 aquí lo inyectas
  ) {}

  //
  // **EXERCISE TYPES**
  //

  // Fetch all exercise types for a gym
  getExerciseTypesByGym(gymId: number): Observable<ExerciseType[]> {
    alert("desde internet")
    const query = `
      query ExerciseTypesByGym($gymId: Float!) {
  exerciseTypesByGym(gymId: $gymId) {
    id
    name
    gymId
      routines {
             id
          name
          description
          link
          path
          count
          exerciseTypeId
          createdAt
          updatedAt
            
          }
  }
}
    `;

    const variables = { gymId };

    return this.http
      .post<{ data: { exerciseTypesByGym: ExerciseType[] } }>(this.graphqlEndpoint, {
        query,
        variables,
      })
      .pipe(map((response) => response.data.exerciseTypesByGym));
  }

  //
  // **ROUTINES**
  //

  
  // Add a new routine
  addRoutine(routine: Routine): Observable<Routine> {
    const mutation = `
      mutation CreateRoutine($createRoutine: CreateRoutine!) {
        createRoutine(createRoutine: $createRoutine) {
          id
          name
          description
          link
          path
          count
          exerciseTypeId
          createdAt
          updatedAt
        }
      }
    `;
  
    // Reemplaza valores null con valores por defecto
    const variables = {
      createRoutine: {
        name: routine.name || '',
        description: routine.description || '',
        link: routine.link || '',
        path: routine.path || '',
        count: routine.count ?? 0, // Si es null o undefined, asigna 0
        exerciseTypeId: routine.exerciseTypeId ?? 0, // Si es null o undefined, asigna 0
      },
    };
  
    console.log('Variables enviadas:', variables);
  
    try {
      return this.http
        .post<{ data: { createRoutine: Routine } }>(this.graphqlEndpoint, {
          query: mutation,
          variables,
        })
        .pipe(
          map((response) => response.data.createRoutine), // Devuelve la rutina creada
          catchError((error) => {
            console.error('Error al crear la rutina:', error);
            throw new Error('No se pudo crear la rutina. Verifica los datos ingresados.');
          })
        );
    } catch (error) {
      console.error('Error interno al procesar la creación de la rutina:', error);
      return throwError(() => new Error('Error interno. Inténtalo de nuevo más tarde.'));
    }
  }
  
  updateRoutine(routine: Routine): Observable<Routine> {
    const mutation = `
      mutation UpdateRoutine($updateRoutine: UpdateRoutine!) {
        updateRoutine(updateRoutine: $updateRoutine) {
          id
          name
          description
          link
          path
          count
          exerciseTypeId
          createdAt
          updatedAt
        }
      }
    `;
  
    // Reemplaza valores `null` con valores por defecto
    const variables = {
      updateRoutine: {
        id: routine.id ?? 0, // ID debe ser obligatorio, se asegura un valor
        name: routine.name || '',
        description: routine.description || '',
        link: routine.link || '',
        path: routine.path || '',
        count: routine.count ?? 0, // Si es null o undefined, asigna 0
        exerciseTypeId: routine.exerciseTypeId ?? 0, // Si es null o undefined, asigna 0
      },
    };
  
    console.log('Variables enviadas para la actualización:', variables);
  
    try {
      return this.http
        .post<{ data: { updateRoutine: Routine } }>(this.graphqlEndpoint, {
          query: mutation,
          variables,
        })
        .pipe(
          map((response) => response.data.updateRoutine), // Devuelve la rutina actualizada
          catchError((error) => {
            console.error('Error al actualizar la rutina:', error);
            throw new Error('No se pudo actualizar la rutina. Verifica los datos ingresados.');
          })
        );
    } catch (error) {
      console.error('Error interno al procesar la actualización de la rutina:', error);
      return throwError(() => new Error('Error interno. Inténtalo de nuevo más tarde.'));
    }
  }
  
    
  // Delete a routine
  deleteRoutine(routineId: number): Observable<boolean> {
    const mutation = `
      mutation DeleteRoutine($deleteRoutineId: Int!) {
        deleteRoutine(id: $deleteRoutineId)
      }
    `;
  
    const variables = { deleteRoutineId: routineId };
  
    return this.http
      .post<{ data: { deleteRoutine: boolean } }>(this.graphqlEndpoint, {
        query: mutation,
        variables,
      })
      .pipe(
        map((response) => {
          // Si el servidor devuelve true, la eliminación fue exitosa
          if (response.data.deleteRoutine) {
            return true;
          } else {
            throw new Error('La rutina no pudo ser eliminada.');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar la rutina:', error);
          throw new Error('No se pudo eliminar la rutina. Inténtalo de nuevo.');
        })
      );
  }
  

async getExerciseTypesWithCache(forceBackend = false): Promise<{ data: ExerciseType[]; source: 'local' | 'backend' }> {
  const encrypted = await localforage.getItem<string>('identity.json');
  if (!encrypted) return { data: [], source: 'local' };

  const identity = JSON.parse(
    CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta').toString(CryptoJS.enc.Utf8)
  );
  const key = `user-${identity.userId}/gym-${identity.gymId}/exerciseTypes`;

  let data: ExerciseType[] = [];
  let source: 'local' | 'backend' = 'local';

  if (!forceBackend) {
    const cached = await localforage.getItem<string>(key);
    if (cached) {
      try {
        const decrypted = CryptoJS.AES.decrypt(cached, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
        data = JSON.parse(decrypted);
        data = this.ensureRoutineFields(data);
        return { data, source };
      } catch (err) {
        console.error('❌ Error leyendo tipos desde caché:', err);
      }
    }
  }

  try {
    data = await firstValueFrom(this.getExerciseTypesByGym(identity.gymId));
    data = this.ensureRoutineFields(data);
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), 'clave-super-secreta').toString();
    await localforage.setItem(key, encryptedData);
    await this.localStorage.saveVersion(identity.userId, identity.gymId, 'exerciseTypes', new Date().toISOString());

    source = 'backend';
    return { data, source };
  } catch (err) {
    console.error('❌ Error desde backend al obtener tipos de ejercicio:', err);
    return { data: [], source: 'backend' };
  }
}


private ensureRoutineFields(types: ExerciseType[]): ExerciseType[] {
  return types.map(t => ({
    ...t,
    routines: (t.routines || []).map(r => ({
      ...r,
      name: r.name || r.description?.split(' ')[0] || 'Sin nombre',
      count: r.count ?? 0,
      exerciseTypeId: r.exerciseTypeId ?? t.id,
      createdAt: r.createdAt || new Date().toISOString(),
      updatedAt: r.updatedAt || new Date().toISOString(),
      link: r.link || '',
      path: r.path || '',
      img: r.img || ''
    }))
  }));
}


  // Fetch all routines by exercise type ID
  getRoutinesByType(exerciseTypeId: number): Observable<Routine[]> {
    alert("Datos de internet")
    const query = `
      query Routines($exerciseTypeId: Int) {
        routines(exerciseTypeId: $exerciseTypeId) {
          id
          name
          description
          link
          path
          count
          exerciseTypeId
          createdAt
          updatedAt
        }
      }
    `;
  
    const variables = { exerciseTypeId };
  
    console.log("GraphQL Query:", query);
    console.log("GraphQL Variables:", variables);
  
    return this.http
      .post<{ data: { routines: Routine[] } }>(environment.apiUrl, {
        query,
        variables,
      })
      .pipe(
        map((response) => {
          console.log("GraphQL Response:", response);
  
          // Safely access and return the routines
          if (response.data && response.data.routines) {
            return response.data.routines.filter((routine) => routine.name !== null);
          } else {
            throw new Error("Invalid response structure from GraphQL.");
          }
        }),
        catchError((error) => {
          console.error("GraphQL Error:", error);
          throw new Error("Failed to fetch routines by type. Please try again later.");
        })
      );
  }
}  
