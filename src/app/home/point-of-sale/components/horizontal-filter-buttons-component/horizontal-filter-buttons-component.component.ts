import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horizontal-filter-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-container">
      <div class="filter-header">
        <h2>{{ title }}</h2>
        <div class="type-scroll">
          <button
            *ngFor="let item of items"
            (click)="selectItem.emit(item)"
            [class.active]="item.id === selectedItem?.id">
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./horizontal-filter-buttons-component.component.scss']
})
export class HorizontalFilterButtonsComponent {
  @Input() title = '';
  @Input() items: { id: number; name: string }[] = [];
  @Input() selectedItem: { id: number; name: string } | null = null;
  @Output() selectItem = new EventEmitter<{ id: number; name: string }>();
}
