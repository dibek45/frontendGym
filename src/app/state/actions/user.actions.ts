import { createAction, createActionGroup, props } from '@ngrx/store';
import { userModel } from 'src/app/core/models/user.interface';

export const loadUser = createAction(
'[Load User]'
);

export const loadedUser = createAction(
    '[Retrieved User List]', props<any>()  
);

export const setUser = createAction(
    '[Set user term]', props<userModel>());

