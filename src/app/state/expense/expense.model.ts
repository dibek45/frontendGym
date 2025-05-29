export interface ExpenseModel {
  id?: number;
  description: string;
  amount: number;
  paymentMethod: string;
  expenseDate: string;
  category: string;
  createdBy: number;
  cashierId: number;
  gymId: number;
  createdAt?: string;
  updatedAt?: string;
  isSynced?: boolean;
  syncError?: boolean;
  tempId?: string;
}
