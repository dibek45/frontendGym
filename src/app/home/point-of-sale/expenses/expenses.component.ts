import { Component } from '@angular/core';
export interface ExpenseModel {
  id: number;
  description: string;
  amount: number;
  paymentMethod: string;
  expenseDate: string; // Fecha del gasto en formato ISO
  category: string; // Categoría del gasto (e.g., "utilities", "travel")
  createdBy: string; // Nombre o ID de quien registró el gasto
  cashierId: number; // ID del cajero asociado al gasto
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {
  data: ExpenseModel[] = [
    {
      id: 1,
      description: "Pago de electricidad",
      amount: 120.50,
      paymentMethod: "credit",
      expenseDate: "2024-11-01T08:30:00.000Z",
      category: "utilities",
      createdBy: "John Doe",
      cashierId: 1
    },
    {
      id: 2,
      description: "Compra de suministros",
      amount: 75.20,
      paymentMethod: "cash",
      expenseDate: "2024-11-03T14:15:00.000Z",
      category: "office supplies",
      createdBy: "Jane Smith",
      cashierId: 2
    },
    {
      id: 3,
      description: "Viaje de negocio",
      amount: 300.00,
      paymentMethod: "debit",
      expenseDate: "2024-11-05T10:00:00.000Z",
      category: "travel",
      createdBy: "Alice Brown",
      cashierId: 1
    }
  ];
  
}
