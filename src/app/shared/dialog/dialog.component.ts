import {ChangeDetectionStrategy, Component, Inject, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,MatInputModule],
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:any){

  }
no(){
  this.data.texto="no";
}
}
