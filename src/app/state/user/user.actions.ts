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

    export const updateAvailableDays = createAction(
        '[User] Update Available Days',
        props<{ days: number; userId: number }>()
      );
      
      export const updateAvailableDaysSuccess = createAction(
        '[User] Update Available Days Success',
        props<{ days: number }>()
      );
      
      export const updateAvailableDaysFailure = createAction(
        '[User] Update Available Days Failure',
        props<{ error: any }>()
      );
      