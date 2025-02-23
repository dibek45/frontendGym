import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
export interface MenuButton {
  label: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-horizontal-menu',
  template:`
    <div class="horizontal-menu">
      <div
        class="menu-button"
        *ngFor="let button of buttons"
        [style.background-color]="button.color"
        (click)="onClick(button.label)"
      >
        <i class="material-icons" style="font-size: 40px; margin-bottom: 10px;">
          {{ button.icon }}
        </i>
        {{ button.label }}
      </div>
    </div>
  `,
  styleUrls: ['./horizontal-menu.component.scss'],
  standalone: true,
  imports:[CommonModule]

})
export class HorizontalMenuComponent {
  @Input() buttons: MenuButton[] = [];
  @Output() buttonClick = new EventEmitter<string>();

  // Alternancia de colores

  // Método para asignar íconos según el botón
  getIcon(button: string): string {
    const icons: { [key: string]: string } = {
      Caja: 'account_balance_wallet',
      Cajeros: 'supervisor_account',
      
      Ventas: 'shopping_cart',
      Gastos: 'money_off',
      'Pagos membresías': 'card_membership',
      Reportes: 'bar_chart',
      Gráficas: 'insert_chart',
    };
    return icons[button] || 'help_outline'; // Ícono por defecto
  }

  onClick(button: string): void {
    this.buttonClick.emit(button); // Emite el nombre del botón clicado
  }
}
