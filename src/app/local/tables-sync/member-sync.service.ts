import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MemberModel } from 'src/app/core/models/member.interface';
import * as MemberActions from 'src/app/state/member/member.actions';
import { LocalEncryptedStorageService } from '../services/local-encrypted-storage.service';

@Injectable({ providedIn: 'root' })
export class MemberSyncService {
  private tableName = 'members';

  constructor(
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

 async handleRemoteUpdate(updatedMember: MemberModel): Promise<void> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) {
    console.warn('❌ No hay identidad local');
    return;
  }

  const members = await this.localStorage.loadTableFromLocalCache<MemberModel>(
    identity.userId,
    identity.gymId,
    this.tableName
  ) ?? [];

  // Comparar por ID con tipo seguro
  const index = members.findIndex(m => String(m.id) === String(updatedMember.id));
  if (index >= 0) {
    members[index] = { ...members[index], ...updatedMember };
    console.log(`✏️ Usuario actualizado localmente (ID ${updatedMember.id})`);
  } else {
    members.push(updatedMember);
    console.log(`🆕 Usuario agregado localmente (ID ${updatedMember.id})`);
  }

  const enrichedMembers = members.map(m => ({
    ...m,
    updatedAt: m.updatedAt ?? new Date().toISOString()
  }));

  await this.localStorage.saveTableToLocalCache(
    identity.userId,
    identity.gymId,
    this.tableName,
    enrichedMembers
  );

  this.store.dispatch(MemberActions.loadedMembers({ members: enrichedMembers }));
}

}
