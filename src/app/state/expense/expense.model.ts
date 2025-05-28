export interface ExpenseModel {
  id: string;
  description: string;
  amount: number;
  paymentMethod: string;
  expenseDate: string;
  category: string;
  createdBy: string;
  cashierId: string;
  gymId: string;
  createdAt?: string;
  updatedAt?: string;
  isSynced?: boolean;
  syncError?: boolean;
  tempId?: string;
}
