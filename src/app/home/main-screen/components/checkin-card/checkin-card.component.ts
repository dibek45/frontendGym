import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkin-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './checkin-card.component.html',
  styleUrls: ['./checkin-card.component.scss']
})
export class CheckinCardComponent {
  @Input() name: string = '';
  @Input() photo: string = '';
  @Input() checkinTime: string = '';
  @Input() status: 'inside' | 'outside' = 'inside';
}
