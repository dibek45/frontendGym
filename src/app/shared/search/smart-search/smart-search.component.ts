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
import { selectAllProducts } from 'src/app/state/product/product.selectors';
import { ProductModel } from 'src/app/core/models/product.interface';

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
  console.log("++++++++++++++++++++++++++++++++++++++++++++++")
  
       

   
console.log(this.data?.modo)
  const gymId = identity.gymId;
  console.log('✅ Identity desde storage:', identity);

  if (this.data?.modo === 'miembro') {
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
 } else if (this.data?.modo == 'producto') {
  console.log('🟢 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢Cargando productos desde Redux');

 this.store.select(selectAllProducts).pipe(take(1)).subscribe((productos) => {
  console.log('🧪 Productos desde Redux:', productos);
  const items = Array.from(productos).map(p => ({
  ...p, // ⬅️ incluye id, stock, etc.
  __tipo: 'producto'
}));

      this.miembrosCargados = true; // 👈 Añade esta línea

  this.setItems([], items);
});

}
 else {
    console.log('🟢 Cargando modo mixto (miembros + rutinas + notas + productos)');
    this.setItems([]); // Asume mezcla
  }
}


  rutinas = [
    { name: 'Rutina de Pierna', descripcion: 'Fuerza inferior', __tipo: 'rutina' },
    { name: 'Rutina FullBody', descripcion: 'Todo el cuerpo', __tipo: 'rutina' }
  ];

  notas = [
    { titulo: 'Nota sobre progresión', descripcion: 'Aumentar peso cada semana', __tipo: 'nota' },
    { titulo: 'Nota de técnica', descripcion: 'Cuidar postura en sentadillas', __tipo: 'nota' }
  ];

 
  abrirEscaneoQr() {
    console.log('🔍 Escaneo QR aún no implementado');
  }

  cerrar() {
    this.dialogRef.close();
  }

 handleSelect(item: any) {
  if (item.__tipo === 'producto') {
    const normalizado: ProductModel = {
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img || '',
      created_at: item.created_at || new Date().toISOString(),
      stock: item.stock ?? 9999,
      available: item.available ?? true
    };

    this.dialogRef.close(normalizado);
  } else {
    this.dialogRef.close(item);
  }
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
  const t = term.toLowerCase();

  this.filteredItems = this.allItems.filter(item => {
    const nombre = item.name?.toLowerCase() || '';
    const titulo = item.titulo?.toLowerCase() || '';
    const descripcion = item.descripcion?.toLowerCase() || '';

    return nombre.includes(t) || titulo.includes(t) || descripcion.includes(t);
  });
}

private setItems(members: any[], productos: any[] = []) {
  const miembros = members.map(member => ({
    name: member.name,
    avatarUrl: member.img,
    status: member.actived ? 'Activa' : 'Vencida',
    __tipo: 'miembro'
  }));

  if (this.data?.modo === 'miembro') {
    this.allItems = miembros;
  } else if (this.data?.modo === 'producto') {
    this.allItems = productos;
  } else {
    this.allItems = [
      ...miembros,
      ...this.rutinas,
      ...this.notas,
      ...productos
    ];
  }

  // 🔥 Añade esto para que se muestren inmediatamente al cargar
  if (this.searchTerm.trim() === '') {
    this.filteredItems = this.allItems;
  } else {
    this.runFilter(this.searchTerm);
  }
}




}
