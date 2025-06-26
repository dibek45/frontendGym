import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from '../../local/services/local-encrypted-storage.service';
import { Routine } from 'src/app/state/routines/routines.model';
import { loadExerciseTypesSuccess, loadRoutinesSuccess } from 'src/app/state/routines/routines.actions';
import { RoutineService } from 'src/app/state/routines/routines.service';

@Injectable({ providedIn: 'root' })
export class RoutineSyncService {
  constructor(
    private localStorage: LocalEncryptedStorageService,
    private store: Store,
      private routineService: RoutineService // 👈 Inyecta esto

  ) {}

  async handleRemoteUpdate(updated: Routine) {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const { userId, gymId } = identity;
    const list = await this.localStorage.loadTableFromLocalCache<Routine>(userId, gymId, 'routines') || [];

    const updatedList = [...list.filter(r => r.id !== updated.id), updated];

    const enrichedList: Routine[] = updatedList.map(r => ({
      ...r,
      updatedAt: typeof r.updatedAt === 'string' ? new Date(r.updatedAt) : r.updatedAt,
      createdAt: typeof r.createdAt === 'string' ? new Date(r.createdAt) : r.createdAt
    }));

    // ✅ Guardar como string en local
    const localFormatList = enrichedList.map(r => ({
      ...r,
      updatedAt: r.updatedAt?.toISOString(),
      createdAt: r.createdAt?.toISOString(),
    }));

    await this.localStorage.saveTableToLocalCache(userId, gymId, 'routines', localFormatList);
    await this.localStorage.saveVersion(userId, gymId, 'routines', updated.updatedAt?.toString() || new Date().toISOString());

    // ✅ Despachar con tipo correcto
const result = await this.routineService.getExerciseTypesWithCache(true);
this.store.dispatch(loadExerciseTypesSuccess({ exerciseTypes: result.data }));
console.log('✅ Routine updated from socket, saved locally, and store updated');    console.log('✅ Routine updated from socket and saved locally');
  }
}
