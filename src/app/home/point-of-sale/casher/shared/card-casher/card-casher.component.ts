import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-casher',
  templateUrl: './card-casher.component.html',
  styleUrls: ['./card-casher.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class CardCasherComponent {
  @Input() cashier: any; // Recibe el objeto cashier desde el componente padre

}
