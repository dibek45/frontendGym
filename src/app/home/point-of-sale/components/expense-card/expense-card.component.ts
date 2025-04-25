import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class ExpenseCardComponent {
  constructor(
    @Inject('membership') public expense: any,
    @Inject('edit') public editClicked: () => void,
    @Inject('delete') public deleteClicked: () => void
  ) {}
}
