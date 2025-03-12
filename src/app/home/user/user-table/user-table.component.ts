import { Component} from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';
import { selectLoading,selectFilteredMembers } from 'src/app/state/member/member.selectors';
import { MemberModel } from 'src/app/core/models/member.interface';
import { AppState } from 'src/app/state/app.state';
import { FingerprintPersonaService } from 'src/app/shared/fingerprint.service';
import { selectUser } from 'src/app/state/user/user.selectors';

import {
  selectSyncedMembers,
  selectUnsyncedMembers,
  selectMembersWithSyncError
} from 'src/app/state/member/member.selectors';
import { OfflineDbService } from 'src/app/db-local/offline-db.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { loadedMembers, setSearchTerm, syncMember } from 'src/app/state/member/member.actions';
import { loadPlansByGym } from 'src/app/state/plan/plan.actions';
import { selectPlansByGymId } from 'src/app/state/plan/plan.selectors';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {


syncedMembers$: Observable<MemberModel[]> = of([]);
unsyncedMembers$: Observable<MemberModel[]> = of([]);
membersWithSyncError$: Observable<MemberModel[]> = of([]);




  filteredMembers: MemberModel[]=[]; // Asume que MemberModel es tu modelo de miembro
  loading$:Observable<Boolean>= new Observable();
  members$:Observable<any>=new Observable();
  searchTerm: string="da";
  gymIdFromStore: number=0;
  plans$: Observable<any[]> = this.store.select(selectPlansByGymId(1));

  constructor( private WebSocketService:FingerprintPersonaService, 
               private store:Store<AppState>,private service:EmployeeService,
               private router: Router,
               private offlineDb: OfflineDbService,
              public notificationService: NotificationService,
                
              ){
  
}
ngOnInit(): void {

  this.offlineDb.hardcodeUsernames().then(() => {
    console.log('✅ Hardcodeo de usernames terminado');
  });
this.deleteHardcodedMembers()
  this.store.select(selectUser).subscribe((users: any) => {
    if (users && users.user) {
      this.gymIdFromStore = users.user.gymId;

      // Intenta primero cargar de IndexedDB
      this.offlineDb.getAllMembersByGym(this.gymIdFromStore).then(localMembers => {
        console.log('📦 Miembros locales:', localMembers);

        // Los metemos en Redux
        this.store.dispatch(loadedMembers({ members: localMembers }));
        this.store.dispatch(loadPlansByGym({ gymId: this.gymIdFromStore }));

        // Opcional: Si hay internet, intentas cargar online también
      //  if (navigator.onLine) {
       //   console.log('🌐 Online, cargando miembros del backend');
          //this.store.dispatch(loadMembers({ gymId: this.gymIdFromStore }));
     //   }
      });
    }
  });

  this.loading$ = this.store.select(selectLoading);
  this.members$ = this.store.select(selectFilteredMembers); // Esto ya lo tienes
}


applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.store.dispatch(setSearchTerm({ searchTerm: filterValue }));
}

ngAfterViewInit() {

}


onCreate() {
  this.service.initializeFormGroup();
  this.router.navigate(['home/user/new-user']);
}

viewDetails(){
  this.router.navigate(['home/user/table/profile/1']);
}

compareFingerprints(gymId:number): void {
  this.WebSocketService.verifyFingerprint(gymId).subscribe({
    next: () => {
      console.log('Verificación de huellas en progreso...');
    },
    error: (error) => {
      console.error('Error en WebSocket:', error);
    }
  });

}
retrySyncUnsyncedMembers(): void {
  this.members$.pipe(take(1)).subscribe(members => {
    // ✅ FILTRAMOS LOS NO SINCRONIZADOS
    const unsyncedMembers = members.filter((member:any) => !member.isSynced);

    console.log('👉 Miembros sin sincronizar:', unsyncedMembers); // ← Debug opcional

    if (unsyncedMembers.length === 0) {
      this.notificationService.mostrarSnackbar('No hay miembros pendientes de sincronización.', 'info');
      return;
    }

    // ✅ DISPATCH A CADA MIEMBRO NO SINCRONIZADO
    unsyncedMembers.forEach((member:any) => {
     this.store.dispatch(syncMember({ member }));
    });

    this.notificationService.mostrarSnackbar('Sincronizando miembros pendientes...', 'info');
  });
}


async desyncAllMembersInLocal(): Promise<void> {
  try {
    await this.offlineDb.desyncAllMembersByGym(this.gymIdFromStore);  // ✅ Aquí haces la llamada

    const updatedMembers = await this.offlineDb.getAllMembersByGym(this.gymIdFromStore);

    this.store.dispatch(loadedMembers({ members: updatedMembers }));

    this.notificationService.mostrarSnackbar('Todos los miembros han sido desincronizados localmente.', 'success');
  } catch (error) {
    console.error('❌ Error al desincronizar:', error);
    this.notificationService.mostrarSnackbar('Error al desincronizar los miembros.', 'error');
  }
}


deleteHardcodedMembers(): void {
  const idsToDelete = ['1741553775126', '1741553800070']; // Los dos IDs que me diste

  this.offlineDb.deleteMembersByIds(idsToDelete)
    .then(() => {
      this.notificationService.mostrarSnackbar('✅ Miembros eliminados de la base local', 'success');
      console.log('🔥 Eliminación completada');

      // Opcional: Recargamos los miembros para refrescar el estado
      this.offlineDb.getAllMembersByGym(this.gymIdFromStore).then(members => {
        this.store.dispatch(loadedMembers({ members }));
      });
    })
    .catch(error => {
      console.error('❌ Error al eliminar miembros:', error);
      this.notificationService.mostrarSnackbar('❌ Error al eliminar miembros', 'error');
    });
}

}
