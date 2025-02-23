import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { saleDetailReducer } from './sale-detail.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('saleDetail', saleDetailReducer), // Reducer como Feature
  ],
})
export class SaleDetailModule {}
