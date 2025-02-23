import { Component} from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadMembers, loadedMembers, setSearchTerm } from 'src/app/state/actions/member.actions';
import { Observable } from 'rxjs';
import { selectLoading,selectFilteredMembers } from 'src/app/state/selectors/member.selectors';
import { MemberModel } from 'src/app/core/models/member.interface';
import { AppState } from 'src/app/state/app.state';
import { FingerprintPersonaService } from 'src/app/shared/fingerprint.service';
import { selectUser } from 'src/app/state/selectors/user.selectors';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {

  filteredMembers: MemberModel[]=[]; // Asume que MemberModel es tu modelo de miembro
  loading$:Observable<Boolean>= new Observable();
  members$:Observable<any>=new Observable();
  searchTerm: string="da";
  gymIdFromStore: number=0;

  constructor( private WebSocketService:FingerprintPersonaService, 
               private store:Store<AppState>,private service:EmployeeService,
               private router: Router){
  
}
  ngOnInit(): void {
    this.store.select(selectUser).subscribe((users: any) => {
      if (users && users.user) {
        console.log("🔍 Usuario obtenido del store:", users);
        this.gymIdFromStore = users.user.gymId;

        if (this.gymIdFromStore) {
          console.log("✅ Cargando miembros del gimnasio ID:", this.gymIdFromStore);
          this.store.dispatch(loadMembers({ gymId: this.gymIdFromStore }));
        }
      }
    });

    this.loading$ = this.store.select(selectLoading);
    this.members$ = this.store.select(selectFilteredMembers);
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
}