import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Promotion } from './promotion.model';

export const PromotionActions = createActionGroup({
  source: 'Promotion/API',
  events: {
    'Load Promotion Types': emptyProps(),
    'Load Promotion Types Success': props<{
      promotionTypes: {
        id: number;
        name: string;
        description: string;
        promotions: { id: number; name: string }[];
      }[];
    }>(),
    'Load Promotion Types Failure': props<{ error: any }>(),
  
    'Load Promotions': emptyProps(), // Load all promotions
    'Load Promotions Success': props<{ promotions: Promotion[] }>(), // On success
    'Load Promotions Failure': props<{ error: any }>(), // On failure

    'Add Promotion': props<{ promotion: Promotion }>(), // Add a promotion
    'Update Promotion': props<{ id: number; changes: Partial<Promotion> }>(), // Update a promotion
    'Delete Promotion': props<{ id: number }>(), // Delete a promotion

    // New actions for filtering and fetching promotions by type
    'Filter Promotions By Type': props<{ typeId: number }>(), // Filter promotions by type

  },
});
