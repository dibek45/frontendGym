import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchResultListComponent } from '../search-result-list/search-result-list.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectFilteredMembers } from 'src/app/state/member/member.selectors';
import { loadMembers } from 'src/app/state/member/member.actions';
import { filter, take } from 'rxjs/operators';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';

@Component({
  selector: 'app-smart-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    SearchBarComponent,
    SearchResultListComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './smart-search.component.html',
  styleUrl: './smart-search.component.scss'
})
export class SmartSearchComponent implements OnInit {
  private miembrosCargados = false;

  searchTerm = '';
  allItems: any[] = [];
  filteredItems: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<SmartSearchComponent>,
    private store: Store<AppState>,
    private localStorage: LocalEncryptedStorageService,
    @Inject(MAT_DIALOG_DATA) public data: { modo?: string }
  ) {}

  async ngOnInit() {
    console.log('🟡 SmartSearch INIT');

    const identity = await this.localStorage.loadIdentity();
    if (!identity || !identity.gymId) {
      console.warn('❌ No se pudo obtener identidad válida desde el storage');
      return;
    }

    const gymId = identity.gymId;
    console.log('✅ Identity desde storage:', identity);

    // 🚀 Usar NgRx solo para miembros
    this.store.select(selectFilteredMembers).pipe(take(1)).subscribe(members => {
      if (members.length === 0) {
        console.log('🔄 No hay miembros. Cargando desde backend para gymId:', gymId);
        this.store.dispatch(loadMembers({ gymId }));

        this.store.select(selectFilteredMembers).pipe(
          filter(m => m.length > 0),
          take(1)
        ).subscribe(reloaded => {
          console.log('📥 Miembros recargados:', reloaded);
this.setItems([...reloaded]);
        });
      } else {
        console.log('📦 Miembros ya presentes:', members);
this.setItems([...members]);
      }
    });
  }

  rutinas = [
    { name: 'Rutina de Pierna', descripcion: 'Fuerza inferior', __tipo: 'rutina' },
    { name: 'Rutina FullBody', descripcion: 'Todo el cuerpo', __tipo: 'rutina' }
  ];

  notas = [
    { titulo: 'Nota sobre progresión', descripcion: 'Aumentar peso cada semana', __tipo: 'nota' },
    { titulo: 'Nota de técnica', descripcion: 'Cuidar postura en sentadillas', __tipo: 'nota' }
  ];

  productos = [
    {
      name: 'Proteína Whey',
      price: 599,
      avatarUrl: 'https://i.imgur.com/abcd123.png',
      __tipo: 'producto'
    },
    {
      name: 'Creatina Monohidratada',
      price: 299,
      __tipo: 'producto'
    }
  ];

  abrirEscaneoQr() {
    console.log('🔍 Escaneo QR aún no implementado');
  }

  cerrar() {
    this.dialogRef.close();
  }

  handleSelect(item: any) {
    this.dialogRef.close(item);
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterItems();
  }
async filterItems() {
  const term = this.searchTerm.toLowerCase().trim();

  if (term.length < 1) {
    this.filteredItems = [];
    return;
  }

  if (!this.miembrosCargados) {
    const identity = await this.localStorage.loadIdentity();
    if (!identity || !identity.gymId) return;

    this.store.dispatch(loadMembers({ gymId: identity.gymId }));

    this.store.select(selectFilteredMembers).pipe(
      filter(m => m.length > 0),
      take(1)
    ).subscribe(members => {
this.setItems([...members]);
      this.miembrosCargados = true;
      this.runFilter(term);
    });
  } else {
    this.runFilter(term);
  }
}

private runFilter(term: string) {
  this.filteredItems = this.allItems.filter(item =>
    (item.name?.toLowerCase().includes(term) || '') ||
    (item.titulo?.toLowerCase().includes(term) || '') ||
    (item.descripcion?.toLowerCase().includes(term) || '')
  );
}

private setItems(members: any[]) {
  const miembros = members.map(member => ({
    name: member.name,
    avatarUrl: member.img,
    status: member.actived ? 'Activa' : 'Vencida',
    __tipo: 'miembro'
  }));

  if (this.data?.modo === 'miembro') {
    this.allItems = miembros;
  } else {
    this.allItems = [
      ...miembros,
      ...this.rutinas,
      ...this.notas,
      ...this.productos
    ];
  }

  // ❌ NO asignes filteredItems aquí
  // this.filteredItems = this.allItems;
}

}
