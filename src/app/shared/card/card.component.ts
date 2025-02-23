import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MemberModel } from 'src/app/core/models/member.interface';
import * as QRCode from 'qrcode';
import { MatIconModule } from '@angular/material/icon';
import * as JsBarcode from 'jsbarcode';
import { AppState } from 'src/app/state/app.state';
import { selectUser } from 'src/app/state/selectors/user.selectors';
import { Store } from '@ngrx/store';
import { PrinterService } from 'src/app/printer.service';
import { Router } from '@angular/router';
import { TruncateNamePipe } from 'src/app/truncate-name.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PlanModalComponent } from './plan-modal/plan-modal.component';
import { selectAllPlans, selectPlansByGymId } from 'src/app/state/plan/plan.selectors';
import { loadPlansByGym } from 'src/app/state/plan/plan.actions';
import { take } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone:true,
  imports:[MatIconModule,TruncateNamePipe, MatMenuModule,
    MatButtonModule,],
    encapsulation: ViewEncapsulation.None, // Apply styles globally


})
export class CardComponent {
  plans$ = this.store.select(selectPlansByGymId(1)); // Filtra planes por gymId

  private modalOpened = false; // 🔥 Controla si el modal ya se abrió

  @Input() element: MemberModel; // Asegúrate de tener esta entrada
  Data: string = ''; // Cambia este valor según tus necesidades
  gymIdFromStore: any;

 


  ngOnInit():void{

    this.store.dispatch(loadPlansByGym({ gymId: 1 })); // Carga los planes del gymId al iniciar

    this.store.select(selectUser).subscribe((users:any) => {
  //if (users.user.gymId!=undefined) {
    this.gymIdFromStore=users.user.gymId;
  this.Data=this.gymIdFromStore+"-"+this.element.id
    });
   
   }
constructor(public dialog: MatDialog,private store:Store<AppState>,private printerService:PrinterService,private router: Router,   
){
  this.element={
    id: '0',
    name: "",
    createdAt: "",
    actived: false, 
    img:""
}
}

async printQR(name:string) {
  await this.printerService.connectToPrinter();
    await this.printerService.printQRAndNombre(this.Data,"grande",name);
}



downloadBarcode() {
  const canvas = document.createElement('canvas'); // Crear un canvas temporal en segundo plano
  JsBarcode(canvas, this.Data, {
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true
  });

  // Convertir el canvas a una imagen y descargarla
  const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
  const downloadLink = document.createElement('a');
  downloadLink.href = image;
  downloadLink.download = 'Barcode.png';
  downloadLink.click();
}


// Navegar a los detalles del producto
viewDetails(productId: string) {
  this.router.navigate(['home/user/profile', productId]);
}

// Función para manejar la opción "Cobrar"
cobrar(plan: any) {
  console.log('Cobrar:', this.element);
  // Aquí puedes agregar la lógica para cobrar
}

// Función para manejar la opción "Agregar a carrito"
agregarAlCarrito(plan: any) {
  console.log('Agregar a carrito:', this.element);
  // Aquí puedes agregar la lógica para agregar al carrito
}

openRenovarModal(): void {
  if (this.modalOpened) return; // 🔥 Evita que se abra más de una vez automáticamente

  this.plans$.pipe(take(1)).subscribe(plans => {
    const dialogRef = this.dialog.open(PlanModalComponent, {
      width: '400px',
      disableClose: true,
      data: { plans } // Pasar los planes filtrados al modal
    });

    this.modalOpened = true; // 🔥 Se marca como abierto para que no se vuelva a abrir solo

    dialogRef.afterClosed().subscribe(result => {
      this.modalOpened = false; // 🔥 Se restablece para permitir abrirlo manualmente después

      if (result) {
        if (result.action === 'cobrar') {
          this.cobrar(result.plan);
        } else if (result.action === 'agregarAlCarrito') {
          this.agregarAlCarrito(result.plan);
        }
      }
    });
  });
}

}
