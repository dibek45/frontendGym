import { Action, createReducer, on } from '@ngrx/store';
import { loadUser,loadedUser, setUser } from '../actions/user.actions';
import { UserState } from 'src/app/core/models/user.state';

export const InitialState: UserState={loading:false,user:{id:0,gymId:0}};

export const UserReducer = createReducer(
    InitialState,
    on(loadUser, (state) => {
        return {...state, loading:true}
    }),
    on(loadedUser, (state, user) => {
        return {...state, loading:false,user}
    }),
    
    on(setUser, (state, user) => {
        return { ...state, user: { ...state.user, user} };  // Actualiza solo el id del usuario
      })
  );
  
 