import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AddPromotionComponent } from './promotions.modal';

@Component({
  selector: 'app-promotion-details',
  templateUrl: './promotion-details.component.html',
  styleUrls: ['./promotion-details.component.scss'],
})
export class PromotionDetailsComponent {
  @Input() type!: { id: number; name: string; description: string; promotions: any[] };


  constructor(private dialog: MatDialog) {}

  openPromotionDialog() {
    const dialogRef = this.dialog.open(AddPromotionComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Promotion saved:', result);
        // Handle the promotion data (e.g., save to backend or update state)
      }
    });
  }
}
