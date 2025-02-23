import { Promotion } from './promotion.model';

export interface PromotionState {
  promotions: Promotion[]; // Flat list of promotions if needed
  promotionTypes: {
    id: number;
    name: string;
    description: string;
    promotions: { id: number; name: string }[];
  }[]; // List of promotion types with nested promotions
  error: any | null;
}

export const initialPromotionState: PromotionState = {
  promotions: [],
  promotionTypes: [],
  error: null,
};

