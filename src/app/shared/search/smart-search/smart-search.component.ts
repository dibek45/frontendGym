import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchResultListComponent } from '../search-result-list/search-result-list.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

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
  constructor(private dialogRef: MatDialogRef<SmartSearchComponent>,@Inject(MAT_DIALOG_DATA) public data: { modo?: string }) {}

  searchTerm = '';
  allItems: any[] = [];
  filteredItems: any[] = [];

 miembros = [
  {
    name: 'David García',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    status: 'Activa'
  },
  {
    name: 'María López',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    status: 'Vencida'
  },
  {
    name: 'Carlos Pérez',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    status: 'Congelada'
  },
  {
    name: 'Laura Gómez',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
    status: 'Activa'
  }
];

  rutinas = [
    { name: 'Rutina de Pierna', avatarUrl: '', status: '', descripcion: 'Fuerza inferior' },
    { name: 'Rutina FullBody', avatarUrl: '', status: '', descripcion: 'Todo el cuerpo' }
  ];

  notas = [
    { titulo: 'Nota sobre progresión', descripcion: 'Aumentar peso cada semana' },
    { titulo: 'Nota de técnica', descripcion: 'Cuidar postura en sentadillas' }
  ];
productos = [
  {
    name: 'Proteína Whey',
    price: 599,
    avatarUrl: 'https://i.imgur.com/abcd123.png' // <-- imagen opcional
  },
  {
    name: 'Creatina Monohidratada',
    price: 299
    // sin imagen
  }
];


ngOnInit() {
  if (this.data?.modo === 'miembro') {
    this.allItems = this.miembros.map(item => ({ ...item, __tipo: 'miembro' }));
  } else {
    this.allItems = [
    ...this.miembros.map(item => ({ ...item, __tipo: 'miembro' })),

      ...this.rutinas.map(item => ({ ...item, __tipo: 'rutina' })),
      ...this.notas.map(item => ({ ...item, __tipo: 'nota' })),
          ...this.productos.map(item => ({ ...item, __tipo: 'producto' })) // ✅ Asegúrate de incluir esto

    ];
  }

  this.filteredItems = this.allItems;
}

  abrirEscaneoQr() {
    console.log('Escaneo QR aún no implementado');
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

  filterItems() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredItems = this.allItems.filter(item =>
      (item.name?.toLowerCase().includes(term) || '') ||
      (item.titulo?.toLowerCase().includes(term) || '') ||
      (item.descripcion?.toLowerCase().includes(term) || '')
      
    );
  }
}
