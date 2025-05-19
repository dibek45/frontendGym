import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResultItemComponent } from '../search-result-item/search-result-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-result-list',
  standalone: true,
  imports: [CommonModule, SearchResultItemComponent],
  templateUrl: './search-result-list.component.html',
  styleUrl: './search-result-list.component.scss'
})
export class SearchResultListComponent {
 @Input() items: any[] = [];
  @Input() query: string = '';
  @Output() itemSelected = new EventEmitter<any>();
@Input() type: string = 'general';

  filteredItems(): any[] {
    return this.items.filter(i =>
      i.name?.toLowerCase().includes(this.query.toLowerCase())
    );
  }
}
