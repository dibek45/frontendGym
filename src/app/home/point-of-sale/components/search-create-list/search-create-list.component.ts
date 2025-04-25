import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MembershipCardComponent } from '../membership-card/membership-card.component';
import { CtnCreateSearchComponent } from '../components/ctn-create-search/ctn-create-search.component';

@Component({
  selector: 'app-search-create-list',
  standalone: true,
  templateUrl: './search-create-list.component.html',
  styleUrls: ['./search-create-list.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    CtnCreateSearchComponent
]
})
export class SearchCreateListComponent {
  constructor(private injector: Injector){

  }
  viewMode: 'table' | 'card' = 'card';
  @Input() cardComponent!: any; // Componente de tarjeta a usar dinámicamente

  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];

  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  filteredData: any[] = [];

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }
  createInjector(item: any): Injector {
    return Injector.create({
      providers: [
        { provide: 'membership', useValue: item }, // para tarjetas como `membership` o `expense`
        { provide: 'edit', useValue: () => this.onEdit(item) },
        { provide: 'delete', useValue: () => this.onDelete(item) }
      ],
      parent: this.injector
    });
  }
  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'card' : 'table';
  }

  onSearch(searchValue: string) {
    const term = searchValue.toLowerCase().trim();
    this.filteredData = this.data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );
  }

  onCreateClick() {
    this.create.emit();
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }



 //necesarios en el padre
  /*
  onCreate() {
    alert('create:');
    // Aquí podrías navegar o abrir modal
    // this.router.navigate(['/ruta/nuevo']);
  }
  
  onEdit(item: any) {
    alert('Eliminar:'+item);
    // Puedes abrir modal o ir a una ruta con ID
    // this.router.navigate(['/ruta/editar', item.id]);
  }
  
  onDelete(item: any) {
    alert('Eliminar:'+item);
    // Aquí puedes abrir un diálogo de confirmación
    // if (confirm('¿Seguro que deseas eliminar?')) {
    //   this.deleteItem(item.id);
    // }
  }  */
}
