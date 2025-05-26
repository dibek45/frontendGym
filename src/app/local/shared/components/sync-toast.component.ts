import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sync-toast',
  standalone: true,
  imports:[MatProgressSpinnerModule],
  templateUrl: './sync-toast.component.html',
  styleUrls: ['./sync-toast.component.scss'],
})
export class SyncToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public tableName: string) {}
}
