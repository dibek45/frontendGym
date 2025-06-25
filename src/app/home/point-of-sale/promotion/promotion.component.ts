import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PromotionActions } from 'src/app/state/promotions/promotion.actions';
import { selectAllPromotionTypesWithPromotions } from 'src/app/state/promotions/promotion.selectors';
import { CommonModule } from '@angular/common';
import { PromotionCardComponent } from '../components/promotion-card/promotion-card.component';
import { CtnCreateSearchComponent } from '../components/components/ctn-create-search/ctn-create-search.component';
import { HorizontalFilterButtonsComponent } from '../components/horizontal-filter-buttons-component/horizontal-filter-buttons-component.component';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [
    CommonModule,
    PromotionCardComponent,
    CtnCreateSearchComponent,
    HorizontalFilterButtonsComponent
  ],
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent {

  promotionTypes$: Observable<{
    id: number;
    name: string;
    description: string;
    promotions: any[];
  }[]>;

  selectedType: {
    id: number;
    name: string;
    description: string;
    promotions: any[];
  } | null = null;

  searchTerm = '';
  filteredPromotions: any[] = [];

  constructor(private store: Store) {
    this.promotionTypes$ = this.store.select(selectAllPromotionTypesWithPromotions);
  }

  ngOnInit(): void {
this.store.dispatch(PromotionActions.loadPromotions());
  }

  selectTypeById(typeId: number) {
    this.promotionTypes$.subscribe(types => {
      const match = types.find(t => t.id === typeId);
      if (match) {
        this.selectedType = match;
        this.applySearchFilter();
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase().trim();
    this.applySearchFilter();
  }

  onCreateClick() {
    console.log('Crear nueva promoción');
  }

  applySearchFilter() {
    if (!this.selectedType) {
      this.filteredPromotions = [];
      return;
    }

    this.filteredPromotions = this.selectedType.promotions.filter(promo =>
      promo.name.toLowerCase().includes(this.searchTerm)
    );
  }
}
