import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
 @Input() placeholder = 'Buscar miembro...';
@Input() query: string = '';
@Output() queryChange = new EventEmitter<string>();
@Output() qr = new EventEmitter<void>();


emitChange() {
  this.queryChange.emit(this.query);
}


  clear() {
    this.query = '';
    this.queryChange.emit('');
  }



}
