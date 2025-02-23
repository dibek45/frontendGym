import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { cashRegisterReducer } from './cash-register.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('cashRegisters', cashRegisterReducer),
  ],
})
export class CashRegisterModule {}
