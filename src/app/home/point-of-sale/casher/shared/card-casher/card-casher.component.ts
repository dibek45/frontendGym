import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card-casher',
  standalone: true,
  templateUrl: './card-casher.component.html',
  styleUrls: ['./card-casher.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class CardCasherComponent {
  constructor(
    @Inject('membership') public cashier: any,
    @Inject('edit') public onEdit: () => void,
    @Inject('delete') public onDelete: () => void
  ) {
  }
}





