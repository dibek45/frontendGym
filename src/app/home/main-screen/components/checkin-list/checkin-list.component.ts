import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
  filteredCheckins: FormattedCheckin[] = [];
@Input() showFilter: boolean = true;

  checkins$: Observable<CheckinModel[]> = this.store.select(selectSyncedCheckins);
members$: Observable<readonly MemberModel[]> = this.store.select(selectFilteredMembers);
@Input() selectedDate: Date | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      this.loadFilteredCheckins();
    }
  }
  constructor(private store: Store<AppState>,
      private localStorage: LocalEncryptedStorageService

  ) {}

async ngOnInit(): Promise<void> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity?.gymId || !identity?.userId) return;

  this.store.select(selectSyncedMembers).pipe(take(1)).subscribe(async members => {
    if (members.length === 0) {
      const cachedMembers = await this.localStorage.loadTableFromLocalCache<any>(
        identity.userId,
        identity.gymId,
        'members'
      );

      if (cachedMembers?.length) {
        this.store.dispatch(loadedMembers({ members: cachedMembers }));
      }
    }

    // 🔥 Espera activamente a que checkins y members estén disponibles antes de filtrar
    combineLatest([
      this.checkins$.pipe(filter(c => c.length > 0), take(1)),
      this.members$.pipe(filter(m => m.length > 0), take(1))
    ]).subscribe(() => {
      this.loadFilteredCheckins();
    });
  });
}




loadFilteredCheckins(): void {
  combineLatest([this.checkins$, this.members$])
    .pipe(
      map(([checkins, members]) => {
const selectedDate = this.selectedDate ?? new Date(); // fallback si es null
const selectedDateStr = selectedDate.toLocaleDateString('sv-SE');
        console.log('📆 Fecha seleccionada:', selectedDateStr);
        console.log('📥 Checkins:', checkins.map(c => ({ id: c.id, memberId: c.memberId, timestamp: c.timestamp })));
        console.log('🧍‍♂️ Members disponibles:', members.map(m => ({ id: m.id, name: m.name })));

       const filtered = checkins.filter(c => {
  const raw = c.timestamp;
  if (!raw) {
    console.warn(`⛔ Checkin ${c.id} sin timestamp`);
    return false;
  }

  const date = typeof raw === 'string' ? new Date(raw) : new Date(Number(raw));
  if (isNaN(date.getTime())) {
    console.warn(`⚠️ Fecha inválida en checkin ${c.id}:`, raw);
    return false;
  }

  const checkinDate = date.toISOString().split('T')[0];
  const match = checkinDate === selectedDateStr;
  console.log(`🧪 Checkin ${c.id}:`, { checkinDate, selectedDateStr, match });

  return match;
});

console.log('🧮 Total después de filtro:', filtered.length);

filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
    if (!m) {
      console.warn('❌ No se encontró el miembro con ID:', c.memberId);
    }

    const dateObj = typeof c.timestamp === 'string'
      ? new Date(c.timestamp)
      : new Date(Number(c.timestamp));

    if (isNaN(dateObj.getTime())) {
      console.error('❌ Timestamp inválido:', c.timestamp);
      return {
        name: 'Sin nombre',
        img: 'https://via.placeholder.com/100',
        time: '00:00',
        date: '0000-00-00',
        inside: false,
      };
    }

    return {
      name: m?.name || 'Sin nombre',
      img: m?.img || 'https://via.placeholder.com/100',
      time: dateObj.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: dateObj.toISOString().slice(0, 10),
      inside: !('checkOutTimestamp' in c),
    };
  });
}

  
}

