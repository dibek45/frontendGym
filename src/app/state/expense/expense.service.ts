import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExpenseModel } from './expense.model';
import { environment } from 'src/environment.prod';
import { firstValueFrom } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import localforage from 'localforage';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { CashRegisterService } from '../point-of-sale/cash-register/cash-register.service';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private graphqlEndpoint = environment.apiUrl;
  private encryptionKey = 'clave-super-secreta';

  constructor(
    private http: HttpClient,
    private localStorage: LocalEncryptedStorageService,
      private cashRegisterService: CashRegisterService // ← ✅ NUEVO

  ) {}

  async getExpensesWithCache(forceBackend = false): Promise<ExpenseModel[]> {
    const encrypted = await localforage.getItem<string>('identity.json');
    if (!encrypted) return [];

    const identity = JSON.parse(
      CryptoJS.AES.decrypt(encrypted, this.encryptionKey).toString(CryptoJS.enc.Utf8)
    );

    const key = `user-${identity.userId}/gym-${identity.gymId}/expenses`;

    if (!forceBackend) {
      const cached = await localforage.getItem<string>(key);
      if (cached) {
        try {
          const decrypted = CryptoJS.AES.decrypt(cached, this.encryptionKey).toString(CryptoJS.enc.Utf8);
          return JSON.parse(decrypted);
        } catch (err) {
          console.error('❌ Error al leer caché de gastos:', err);
        }
      }
    }

    try {
      const expenses = await this.fetchExpenses(identity.gymId);
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(expenses), this.encryptionKey).toString();
      await localforage.setItem(key, encryptedData);
      await this.localStorage.saveVersion(identity.userId, identity.gymId, 'expenses', new Date().toISOString());
      return expenses;
    } catch (err) {
      console.error('❌ Error al obtener gastos desde el backend:', err);
      return [];
    }
  }

  private async fetchExpenses(gymId: number): Promise<ExpenseModel[]> {
    const query = `
      query ExpensesByGym($gymId: Int!) {
        expensesByGym(gymId: $gymId) {
          id
          description
          amount
          paymentMethod
          expenseDate
          category
          createdBy
          cashierId
          gymId
          createdAt
          updatedAt
          isSynced
          syncError
          tempId
        }
      }
    `;

    const variables = { gymId };
    const result = await firstValueFrom(
      this.http.post<any>(this.graphqlEndpoint, { query, variables })
    );

    return result.data.expensesByGym;
  }

async createExpense(expense: ExpenseModel): Promise<ExpenseModel> {
    console.log('🧾 Cantidad enviada:', expense.amount, 'Tipo:', typeof expense.amount); // 👈 Agrega esto

  const mutation = `
    mutation CreateExpense($createExpense: CreateExpenseInput!) {
      createExpense(createExpense: $createExpense) {
        id
        description
        amount
        paymentMethod
        expenseDate
        category
        createdBy
        cashierId
        gymId
        createdAt
        updatedAt
        isSynced
        syncError
        tempId
      }
    }
  `;

const input = {
  amount: expense.amount,
  description: expense.description,
  paymentMethod: expense.paymentMethod,
  expenseDate: expense.expenseDate,
  category: expense.category,
  createdBy: String(expense.createdBy), // ⚠️ obligatorio si espera string
  cashierId: expense.cashierId,
  gymId: expense.gymId,
  cashRegisterId: 255// ✅ asegúrate de tener este valor

  
};

const variables = { createExpense: input };

  try {
    const response = await firstValueFrom(
      this.http.post<any>(this.graphqlEndpoint, { query: mutation, variables })
    );

    if (response.errors) {
  console.error('❌ Errores GraphQL:', response.errors);
}
    const createdExpense = response.data?.createExpense;
    if (!createdExpense) throw new Error('No se pudo crear el gasto');


    
    return createdExpense;

  } catch (err) {
    console.error('❌ Error en createExpense:', err);
    throw err;
  }
}





}
