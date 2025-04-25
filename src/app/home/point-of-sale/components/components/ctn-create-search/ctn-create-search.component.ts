import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ctn-create-search',
  standalone: true,
  templateUrl: './ctn-create-search.component.html',
  styleUrls: ['./ctn-create-search.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class CtnCreateSearchComponent {
  searchTerm: string = '';

  @Output() searchChanged = new EventEmitter<string>();
  @Output() createClicked = new EventEmitter<void>();

  onSearchChange() {
    this.searchChanged.emit(this.searchTerm);
  }

  onCreate() {
    this.createClicked.emit();
  }
}
