import { Component, Input } from '@angular/core';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { AddCashRegisterComponent } from "../add-cash-register/add-cash-register.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-cash-register-item',
  templateUrl: './card-cash-register-item.component.html',
  styleUrls: ['./card-cash-register-item.component.scss'],
  standalone:true,
  imports: [CommonModule,]
})
export class CardCashRegisterItemComponent {
  @Input() cashRegister!: CashRegister;

}
