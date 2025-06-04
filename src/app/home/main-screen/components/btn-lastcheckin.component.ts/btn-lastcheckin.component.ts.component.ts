import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { CheckinModel } from 'src/app/state/checkins/checkins.model';
import { selectSyncedCheckins } from 'src/app/state/checkins/checkins.selectors';
import { selectAllMembers } from 'src/app/state/member/member.selectors';
import { filter, take } from 'rxjs';
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



  this.store.select(selectSyncedCheckins).subscribe((checkins: CheckinModel[]) => {
    const ultimo = checkins
      .filter(c => c.timestamp)
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))[0];

    this.lastCheckin = ultimo; // 👈 esto es lo que te faltaba

    const parsedDate = ultimo?.timestamp ? new Date(Number(ultimo.timestamp)) : null;

    this.ultimoCheckinHora =
      parsedDate instanceof Date && !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        : null;
  });
}



verDetalle() {
  if (!this.lastCheckin) {
    alert("No hay último check-in");
    return;
  }

  const memberId = this.lastCheckin.memberId;

  this.store.select(selectAllMembers).pipe(take(1)).subscribe(members => {
    if (members.length === 0) {
      console.log('🔄 Cargando miembros desde el backend');
      const gymId = 1; // O usa identity.gymId si lo tienes

      this.store.dispatch(loadMembers({ gymId }));

      this.store.select(selectAllMembers).pipe(
        filter(m => m.length > 0),
        take(1)
      ).subscribe(cargados => {
        const member = cargados.find(m => Number(m.id) === memberId);
        if (member) this.abrirModal(member);
      });
    } else {
      const member = members.find(m => Number(m.id) === memberId);
      if (member) this.abrirModal(member);
    }
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
