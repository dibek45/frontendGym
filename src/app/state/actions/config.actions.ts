import { createAction, createActionGroup, props } from '@ngrx/store';
import { ConfigModel } from 'src/app/core/models/config.interface ';


export const loadConfig = createAction(
'[Load config]'
);

export const loadedConfig = createAction(
    '[Retrieved config List]', props<{ config: ReadonlyArray<ConfigModel> }>(),
);


export const setSearchTerm = createAction(
    '[Set search term]', props<{ searchTerm: string }>());
