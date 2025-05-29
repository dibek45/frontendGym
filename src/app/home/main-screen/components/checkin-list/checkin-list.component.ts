import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinCardComponent } from '../checkin-card/checkin-card.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CheckinModel, FormattedCheckin } from 'src/app/state/checkins/checkins.model';
import { MemberModel } from 'src/app/core/models/member.interface';
import { Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSyncedCheckins } from 'src/app/state/checkins/checkins.selectors';
import { selectFilteredMembers, selectSyncedMembers } from 'src/app/state/member/member.selectors';
import { AppState } from 'src/app/state/app.state';
import { filter, map, take } from 'rxjs/operators';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { selectUser } from 'src/app/state/user/user.selectors';
import { loadedMembers } from 'src/app/state/member/member.actions';

@Component({
  selector: 'app-checkin-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    CheckinCardComponent,
  ],
  templateUrl: './checkin-list.component.html',
})
export class CheckinListComponent implements OnInit {
  selectedDate: Date = new Date();
  filteredCheckins: FormattedCheckin[] = [];

  checkins$: Observable<CheckinModel[]> = this.store.select(selectSyncedCheckins);
members$: Observable<readonly MemberModel[]> = this.store.select(selectFilteredMembers);

  constructor(private store: Store<AppState>,
      private localStorage: LocalEncryptedStorageService

  ) {}

async ngOnInit(): Promise<void> {
  // Espera a que cargue el usuario para obtener gymId
  const identity = await this.localStorage.loadIdentity();
  if (!identity?.gymId || !identity?.userId) return;

  // Carga los miembros desde caché local si no están en el store
  this.store.select(selectSyncedMembers).pipe(take(1)).subscribe(async members => {
    if (members.length === 0) {
      const cachedMembers = await this.localStorage.loadTableFromLocalCache<any>(
        identity.userId,
        identity.gymId,
        'members'
      );

      if (cachedMembers?.length) {
        console.log('✅ Despachando miembros desde caché manualmente:', cachedMembers);
this.store.dispatch(loadedMembers({ members: cachedMembers }));
      }
    }

    this.loadFilteredCheckins(); // Ahora sí procesar
  });
}



loadFilteredCheckins(): void {
  combineLatest([this.checkins$, this.members$])
    .pipe(
      map(([checkins, members]) => {
        const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
        console.log('📆 Fecha seleccionada:', selectedDateStr);
        console.log('📥 Checkins:', checkins.map(c => ({ id: c.id, memberId: c.memberId, timestamp: c.timestamp })));
        console.log('🧍‍♂️ Members disponibles:', members.map(m => ({ id: m.id, name: m.name })));

        const filtered = checkins.filter(c => {
          if (!c.timestamp) return false;

          const date = new Date(Number(c.timestamp));
          if (isNaN(date.getTime())) return false;

          const checkinDate = date.toISOString().split('T')[0];
          return checkinDate === selectedDateStr;
        });

const formatted=this.formatCheckinsForUI(filtered, [...members])

        return formatted;
      })
    )
    .subscribe(formatted => {
      this.filteredCheckins = formatted;
      console.log('✅ Resultado formateado:', formatted);
    });
}



  filterCheckins(): void {
    this.loadFilteredCheckins();
  }

  formatCheckinsForUI(checkins: CheckinModel[], members: MemberModel[]): FormattedCheckin[] {
    return checkins.map(c => {
      const m = members.find(m => String(m.id) === String(c.memberId));
      return {
        name: m?.name || 'Sin nombre',
        img: m?.img || 'https://via.placeholder.com/100',
        time: new Date(Number(c.timestamp)).toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: new Date(Number(c.timestamp)).toISOString().slice(0, 10),
        inside: !('checkOutTimestamp' in c),
      };
    });
  }
  
}

