import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from 'src/app/core/models/user.state'; 

export const SelectFeature = (state:AppState)=>state.user;

export const selectUser = createSelector(
    SelectFeature,
    (state:UserState) => state.user
  );
  
  


  
export const selectLoading = createSelector(
    SelectFeature,
    (state:UserState) => state.loading
  );


  