import { createReducer, on } from '@ngrx/store';
import { CashRegisterState, initialCashRegisterState } from './cash-register.state';
import { CashRegisterActions } from './cash-register.actions';

export const cashRegisterReducer = createReducer(
  initialCashRegisterState,

  // Cargar cajas registradoras exitosamente
  on(CashRegisterActions['loadCashRegistersSuccess'], (state, { cashRegisters }) => {
    console.log('Reducer - Load CashRegisters Success:', cashRegisters);
    return {
      ...state,
      cashRegisters, // Actualiza el estado con todos los registros cargados
      error: null,
    };
  }),

  // Agregar una caja registradora exitosamente
  on(CashRegisterActions['addCashRegisterSuccess'], (state, { cashRegister }) => {
    console.log('Reducer - Add CashRegister Success:', cashRegister);
    return {
      ...state,
      cashRegisters: [...state.cashRegisters, cashRegister], // Agrega el nuevo registro al estado
      error: null,
    };
  }),

  // Manejo de errores
  on(CashRegisterActions['loadCashRegistersFailure'], (state, { error }) => {
    console.error('Reducer - Load CashRegisters Failure:', error);
    return {
      ...state,
      error,
    };
  }),

  on(CashRegisterActions['addCashRegisterFailure'], (state, { error }) => {
    console.error('Reducer - Add CashRegister Failure:', error);
    return {
      ...state,
      error,
    };
  })
);

