import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { SaleDetail } from 'src/app/core/models/sale-detail.state';


export const SaleDetailActions = createActionGroup({
  source: 'SaleDetail/API',
  events: {
    'Load SaleDetails': emptyProps(),
    'Load SaleDetails Success': props<{ saleDetails: SaleDetail[] }>(),
    'Load SaleDetails Failure': props<{ error: any }>(), // Define esta acción
    'Add SaleDetail': props<{ saleDetail: SaleDetail }>(),
    'Update SaleDetail': props<{ id: string; changes: Partial<SaleDetail> }>(),
    'Delete SaleDetail': props<{ id: string }>(),
    'Clear SaleDetails': emptyProps()
  },
});