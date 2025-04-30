import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card-cashregister',
  standalone: true,
  templateUrl: './card-cashregister.component.html',
  styleUrls: ['./card-cashregister.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class CardCashregisterComponent {
  constructor(
    @Inject('membership') public cashRegister: any,
    @Inject('edit') public onEdit: () => void,
    @Inject('delete') public onDelete: () => void
  ) {}
}


