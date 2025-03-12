import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-registro-completado',
  templateUrl: './dialog-registro-completado.component.html',
  styleUrls: ['./dialog-registro-completado.component.scss']
})
export class DialogRegistroCompletadoComponent {

  constructor(public dialogRef: MatDialogRef<DialogRegistroCompletadoComponent>,    private router: Router,
  ) {}

  cerrar() {
    this.dialogRef.close('ok');
       this.router.navigate(['home/user/table']);

  }

}
