import { createAction, createActionGroup, props } from '@ngrx/store';

export const loadHuella = createAction(
'[Load huella]'
);

export const loadedHuella = createAction(
    '[Retrieved huella List]', props<{ id: Readonly<number>}>(),
);


