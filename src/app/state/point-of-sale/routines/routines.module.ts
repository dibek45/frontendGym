import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { routinesReducer } from './routines.reducer'; // Importa el reducer de routines
import { RoutinesEffects } from './routines.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('routines', routinesReducer), // Cambiado 'cashier' por 'routines'
    EffectsModule.forFeature([RoutinesEffects]), // Cambiado CashierEffects por RoutineEffects
  ],
})
export class RoutineModule {}
