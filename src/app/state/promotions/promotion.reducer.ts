import { createReducer, on } from '@ngrx/store';
import { PromotionActions } from './promotion.actions';
import { initialPromotionState } from './promotion.state';

export const promotionReducer = createReducer(
  initialPromotionState,

  // Load promotions successfully
  on(PromotionActions['loadPromotionsSuccess'], (state, { promotions }) => ({
    ...state,
    promotions,
    error: null,
  })),

  // Error loading promotions
  on(PromotionActions['loadPromotionsFailure'], (state, { error }) => ({
    ...state,
    error,
  })),

  // Add a promotion
  on(PromotionActions['addPromotion'], (state, { promotion }) => ({
    ...state,
    promotions: [...state.promotions, promotion],
  })),

  // Update a promotion
  on(PromotionActions['updatePromotion'], (state, { id, changes }) => ({
    ...state,
    promotions: state.promotions.map((promotion) =>
      promotion.id === id ? { ...promotion, ...changes } : promotion
    ),
  })),

  // Delete a promotion
  on(PromotionActions['deletePromotion'], (state, { id }) => ({
    ...state,
    promotions: state.promotions.filter((promotion) => promotion.id !== id),
  })),

  // Load promotion types successfully
  on(PromotionActions['loadPromotionTypesSuccess'], (state, { promotionTypes }) => ({
    ...state,
    promotionTypes,
    error: null,
  })),

  // Error loading promotion types
  on(PromotionActions['loadPromotionTypesFailure'], (state, { error }) => ({
    ...state,
    error,
  })),

  // Filter promotions by type
  on(PromotionActions['filterPromotionsByType'], (state, { typeId }) => ({
    ...state,
    filteredPromotions: state.promotions.filter((promotion) => promotion.promotionTypeId === typeId),
  }))
);
