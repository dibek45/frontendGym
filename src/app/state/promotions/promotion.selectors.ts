import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PromotionState } from './promotion.state';

// Select the entire promotion state
export const selectPromotionState = createFeatureSelector<PromotionState>('promotions');

// Select all promotion types with their nested promotions
export const selectAllPromotionTypesWithPromotions = createSelector(
  selectPromotionState,
  (state) => state.promotionTypes
);

// Select all promotions (flat list)
export const selectAllPromotions = createSelector(
  selectPromotionState,
  (state) => state.promotionTypes.flatMap((type) => type.promotions)
);

// Select a promotion by ID
export const selectPromotionById = (id: number) =>
  createSelector(selectAllPromotions, (promotions) =>
    promotions.find((promotion) => promotion.id === id)
  );

// Select promotions by type ID
export const selectPromotionsByType = (typeId: number) =>
  createSelector(selectAllPromotionTypesWithPromotions, (promotionTypes) =>
    promotionTypes.find((type) => type.id === typeId)?.promotions || []
  );

// Select a promotion type by ID
export const selectPromotionTypeById = (typeId: number) =>
  createSelector(selectAllPromotionTypesWithPromotions, (promotionTypes) =>
    promotionTypes.find((type) => type.id === typeId)
  );
