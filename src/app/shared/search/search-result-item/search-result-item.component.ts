import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-result-item',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './search-result-item.component.html',
  styleUrl: './search-result-item.component.scss'
})
export class SearchResultItemComponent {
 @Input() item: any;
@Input() type: string = 'general';
  @Output() selected = new EventEmitter<any>();
}
