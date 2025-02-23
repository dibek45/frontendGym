import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { salesReducer } from './sale.reducer';
import { SalesEffects } from './sales.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('sales', salesReducer), // Registrar el reducer de ventas
        EffectsModule.forFeature([SalesEffects]),
    
  ],
})
export class SaleModule {}