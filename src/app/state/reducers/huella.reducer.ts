import { Action, createReducer, on } from '@ngrx/store';
import { loadHuella,loadedHuella  } from '../actions/huella.actions';
import { HuellaState } from 'src/app/core/models/huella.state';

export const InitialState: HuellaState={loading:false,id:0};

export const HuellaReducer = createReducer(
    InitialState,
    on(loadHuella, (state) => {
        return {...state, loading:true}
    }),
    on(loadedHuella, (state, a) => {
        return {...state, loading:false,id:a.id}
    }),
    
  
  );
  
 