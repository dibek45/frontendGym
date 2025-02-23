import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { cashierReducer } from './cashier.reducer';
import { CashierEffects } from './cashier.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('cashier', cashierReducer),
    EffectsModule.forFeature([CashierEffects]),
  ],
})
export class CashierModule {}
