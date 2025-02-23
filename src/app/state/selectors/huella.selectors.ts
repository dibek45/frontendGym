import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { HuellaState } from 'src/app/core/models/huella.state';
 

export const SelectFeature = (state:AppState)=>state.id;

export const selectItemsList = createSelector(
    SelectFeature,
    (state:HuellaState) => state.id
  );
  

export const selectLoading = createSelector(
    SelectFeature,
    (state:HuellaState) => state.loading
  );


  