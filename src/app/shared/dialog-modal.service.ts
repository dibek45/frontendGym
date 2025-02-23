import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogModalService {

  constructor(public dialog: MatDialog) {

   }

   openDialog(enterAnimationDuration: string, exitAnimationDuration: string, titulo:string,texto:string): void {
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        titulo:titulo,
        texto: texto,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      alert(result);
     
    });
  }

}
