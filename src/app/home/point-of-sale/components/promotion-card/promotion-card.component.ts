import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // ⬅️ Asegúrate de importar esto
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-promotion-card',
  standalone: true, // si es standalone
  templateUrl: './promotion-card.component.html',
  styleUrls: ['./promotion-card.component.scss'],
  imports: [CommonModule,MatIconModule] // ⬅️ agrega esto
})
export class PromotionCardComponent {
handleImageError($event: ErrorEvent) {
throw new Error('Method not implemented.');
}
onEdit(obj:any) {
throw new Error('Method not implemented.');
}
onDelete(id:number) {
throw new Error('Method not implemented.');
}
  @Input() promotion: any;
  @Input() typeId?: number;

get imageSrc(): string {
  switch (this.typeId) {
    case 1: return 'assets/fallback-promo.jpg';
    case 2: return 'assets/promo/premium.jpg';
    case 3: return 'assets/promo/amigo.jpg';
    default: return 'assets/promo/new.jpg';
  }
}
}
