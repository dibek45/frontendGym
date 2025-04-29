import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseCardComponent } from '../components/expense-card/expense-card.component';
import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { SummaryWeeklyComponent } from '../components/earnings-summary/summary-weekly.component';

export interface ExpenseModel {
  id: number;
  description: string;
  amount: number;
  paymentMethod: string;
  expenseDate: string;
  category: string;
  createdBy: string;
  cashierId: number;
}

export interface DataPerDay {
  date: string;
  amount: number;
  tickets: number;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  imports: [CommonModule, SummaryWeeklyComponent, SearchCreateListComponent],
})
export class ExpensesComponent {
  cardComponent = ExpenseCardComponent;
  
  displayedColumns: string[] = [
    'id',
    'description',
    'amount',
    'paymentMethod',
    'expenseDate',
    'category',
    'createdBy',
    'actions'
  ];
  
  data: ExpenseModel[] = [
    {
      id: 1,
      description: 'Pago de luz',
      amount: 120,
      paymentMethod: 'cash',
      expenseDate: '2024-10-28T10:00:00Z',
      category: 'utilities',
      createdBy: 'John',
      cashierId: 1
    },
    {
      id: 2,
      description: 'Pago de agua',
      amount: 90,
      paymentMethod: 'card',
      expenseDate: '2024-10-30T14:00:00Z',
      category: 'utilities',
      createdBy: 'Alice',
      cashierId: 2
    },
    {
      id: 3,
      description: 'Internet',
      amount: 150,
      paymentMethod: 'transfer',
      expenseDate: '2024-11-01T12:00:00Z',
      category: 'services',
      createdBy: 'Bob',
      cashierId: 1
    }
  ];

  startOfWeek = new Date('2024-10-28');

  gastosSemana: DataPerDay[] = this.data.map(gasto => ({
    date: gasto.expenseDate.split('T')[0],
    amount: gasto.amount,
    tickets: 1
  }));

  showActivityList = false; // 🔵 NUEVA VARIABLE para controlar qué mostrar

  handleSeeActivity() {
    this.showActivityList = true; // 🔵 Mostrar lista
  }

  handleBackToSummary() {
    this.showActivityList = false; // 🔵 Volver al resumen
  }

  onCreate() {
    alert('create:');
  }

  onEdit(item: any) {
    alert('Editar: ' + item);
  }

  onDelete(item: any) {
    alert('Eliminar: ' + item);
  }
}
