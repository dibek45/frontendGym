import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { CheckinModel } from 'src/app/state/checkins/checkins.model';
import { selectSyncedCheckins } from 'src/app/state/checkins/checkins.selectors';
import { selectAllMembers } from 'src/app/state/member/member.selectors';
import { filter, of, switchMap, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LastCheckinModalComponent } from './last-checkin-modal.component.ts/last-checkin-modal.component.ts.component';
import { loadMembers } from 'src/app/state/member/member.actions';

@Component({
  selector: 'app-btn-lastcheckin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-lastcheckin.component.ts.component.html',
  styleUrl: './btn-lastcheckin.component.ts.component.scss'
})
export class BtnLastCheckinComponent implements OnInit {
  ultimoCheckinHora: string | null = null;
  lastCheckin: CheckinModel | null = null;

  constructor(private store: Store<AppState>, private dialog: MatDialog,) {}

ngOnInit(): void {
  this.store.select(selectSyncedCheckins).pipe(
    filter(checkins => checkins.length > 0),
    take(1)
  ).subscribe((checkins: CheckinModel[]) => {
    const ultimo = checkins
      .filter(c => c.createdAt)
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))[0];

    this.lastCheckin = ultimo;

    const parsedDate = ultimo?.timestamp ? new Date(ultimo.timestamp) : null;

    this.ultimoCheckinHora =
      parsedDate instanceof Date && !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        : null;

    // ✅ Ahora que ya tienes lastCheckin, puedes llamar verDetalle
      this.store.select(selectSyncedCheckins).pipe(take(1)).subscribe((checkins: CheckinModel[]) => {
    // Obtener el último check-in con timestamp o createdAt
    const ultimo = checkins
      .filter(c => c.createdAt)
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))[0];

    this.lastCheckin = ultimo;


    if (!this.lastCheckin) {
      alert("No hay último check-in");
      return;
    }

    const parsedDate = this.lastCheckin.timestamp
      ? new Date(Number(this.lastCheckin.timestamp))
      : null;

    this.ultimoCheckinHora =
      parsedDate instanceof Date && !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        : null;

    const memberId = this.lastCheckin.memberId;

   this.store.select(selectSyncedCheckins).pipe(
  filter(checkins => checkins.length > 0),
  take(1)
).subscribe((checkins: CheckinModel[]) => {
  const ultimo = checkins
    .filter(c => c.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  this.lastCheckin = ultimo;

  const parsedDate = ultimo?.timestamp ? new Date(ultimo.timestamp) : null;

  this.ultimoCheckinHora =
    parsedDate instanceof Date && !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      : null;
});

  });
  });
}






verDetalle() {
  this.store.select(selectSyncedCheckins).pipe(take(1)).subscribe((checkins: CheckinModel[]) => {
    const validCheckins = checkins.filter(c => c.timestamp);

    // Ordenar por timestamp real, no createdAt
    const ultimo = validCheckins
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    this.lastCheckin = ultimo;

    if (!this.lastCheckin) {
      alert("No hay último check-in");
      return;
    }

    const parsedDate = typeof this.lastCheckin.timestamp === 'string'
      ? new Date(this.lastCheckin.timestamp)
      : new Date(Number(this.lastCheckin.timestamp));

    this.ultimoCheckinHora =
      parsedDate instanceof Date && !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        : null;

    const memberId = this.lastCheckin.memberId;

    this.store.select(selectAllMembers).pipe(
      take(1),
      switchMap(members => {
        if (members.length > 0) {
          return of(members);
        } else {
          const gymId = 1;
          this.store.dispatch(loadMembers({ gymId }));
          return this.store.select(selectAllMembers).pipe(
            filter(m => m.length > 0),
            take(1)
          );
        }
      })
    ).subscribe(members => {
      const member = members.find(m => Number(m.id) === Number(memberId));
      if (member) {
        this.abrirModal(member);
      } else {
        alert(`❌ Miembro con ID ${memberId} no encontrado`);
      }
    });
  });
}




abrirModal(member: any) {
  this.dialog.open(LastCheckinModalComponent, {
    width: '300px',
    data: {
      member,
      checkin: this.lastCheckin
    }
  });
}

}
