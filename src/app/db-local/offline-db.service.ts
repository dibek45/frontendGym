import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { MemberModel } from '../core/models/member.interface';

@Injectable({ providedIn: 'root' })
export class OfflineDbService extends Dexie {
  members!: Table<MemberModel, string>;

  constructor() {
    super('OfflineMembersDB');

    this.version(1).stores({
      members: 'id, gymId, isSynced' // Agregamos gymId como índice
    });
  }

  saveMember(member: MemberModel) {
    return this.members.add(member);
  }

  updateMember(id: string, changes: Partial<MemberModel>) {
    return this.members.update(id, changes);
  }

  getUnsyncedMembersByGym(gymId: number): Promise<MemberModel[]> {
    return this.members
      .where('gymId').equals(gymId)
      .and(m => !m.isSynced)
      .toArray();
  }



  //local
  getAllMembers(): Promise<MemberModel[]> {
    return this.members.toArray();
  }
  

  getAllMembersByGym(gymId: number): Promise<MemberModel[]> {
    return this.members
      .where('gymId')
      .equals(gymId)
      .toArray();
  }

  async desyncAllMembersByGym(gymId: number): Promise<void> {
    const members = await this.getAllMembersByGym(gymId); // ❌ Esto no existe aquí
    const updates = members.map(member => this.updateMember(member.id!, { isSynced: false }));
    await Promise.all(updates);
  }
  
  async deleteMembersByIds(ids: string[]): Promise<void> {
    const deletions = ids.map(id => this.members.delete(id));
    await Promise.all(deletions);
    console.log(`🗑️ Miembros eliminados: ${ids.join(', ')}`);
  }
  
  // ✅ Hardcode: Asignar username a todos los miembros locales
async hardcodeUsernames(): Promise<void> {
  const members = await this.getAllMembers();
  
  const updates = members.map(async (member, index) => {
    const hardcodedUsername = `user_${index + 1}`; // Ejemplo: user_1, user_2, user_3...
    
    console.log(`🔧 Asignando username a ${member.name}: ${hardcodedUsername}`);
    
    return this.updateMember(member.id!, { username: hardcodedUsername });
  });

  await Promise.all(updates);

  console.log('✅ Todos los usernames fueron hardcodeados correctamente.');
}

}
