import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-cash',
  templateUrl: './card-cash.component.html',
  styleUrls: ['./card-cash.component.scss'],
  standalone: true,
  imports: [MatButtonToggleModule, FormsModule, ReactiveFormsModule,MatIconModule],
})
export class CardCashComponent {
  fontStyleControl = new FormControl('');
  fontStyle?: string;
}
