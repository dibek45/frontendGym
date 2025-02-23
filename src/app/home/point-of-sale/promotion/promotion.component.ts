import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PromotionActions } from 'src/app/state/promotions/promotion.actions';
import { selectAllPromotionTypesWithPromotions, selectPromotionsByType } from 'src/app/state/promotions/promotion.selectors';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent {
  promotionTypes$: Observable<{ id: number; name: string; description: string; promotions: any[] }[]>; 
  selectedType: { id: number; name: string; description: string; promotions: any[] } | null = null;

  constructor(private store: Store) {
    this.promotionTypes$ = this.store.select(selectAllPromotionTypesWithPromotions);
  }

  ngOnInit(): void {
    // Dispatch action to load promotion types from GraphQL API
    this.store.dispatch(PromotionActions.loadPromotionTypes());
  }

  selectType(type: { id: number; name: string; description: string; promotions: any[] }) {
    this.selectedType = type;
  }

}