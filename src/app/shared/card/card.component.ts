import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MemberModel } from 'src/app/core/models/member.interface';
import * as QRCode from 'qrcode';
import { MatIconModule } from '@angular/material/icon';
import * as JsBarcode from 'jsbarcode';
import { AppState } from 'src/app/state/app.state';
import { selectUser } from 'src/app/state/user/user.selectors';
import { Store } from '@ngrx/store';
import { PrinterService } from 'src/app/printer.service';
import { Router } from '@angular/router';
import { TruncateNamePipe } from 'src/app/truncate-name.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PlanModalComponent } from './plan-modal/plan-modal.component';
import { take } from 'rxjs';
import { ProductModel } from 'src/app/core/models/product.interface';
import { CartService } from 'src/app/state/point-of-sale/cart/cart.service';
import { CartItemModel } from 'src/app/home/product/cart/cart-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    MatIconModule,TruncateNamePipe, MatMenuModule,
    MatButtonModule,],
    encapsulation: ViewEncapsulation.None, // Apply styles globally


})
export class CardComponent {
editUser(arg0: MemberModel) {
throw new Error('Method not implemented.');
}
  @Input() plans: any[] | null = null;

  private modalOpened = false; // 🔥 Controla si el modal ya se abrió

  @Input() user: MemberModel; // Asegúrate de tener esta entrada
  Data: string = ''; // Cambia este valor según tus necesidades
  gymIdFromStore: any;

 


  ngOnInit():void{


    this.store.select(selectUser).subscribe((users:any) => {
  //if (users.user.gymId!=undefined) {
    this.gymIdFromStore=users.user.gymId;
  this.Data=this.gymIdFromStore+"-"+this.user.id
    });
   
   }
constructor(public dialog: MatDialog,private store:Store<AppState>,private printerService:PrinterService,private router: Router,   private _cartService:CartService
){
  this.user={
    id: '0',
    name: "",
    createdAt: "",
    actived: false, 
    available_days:0,
    img:"",
    gymId:0,
    username:''
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
  console.log('Cobrar:', this.user);
  // Aquí puedes agregar la lógica para cobrar
}

// Función para manejar la opción "Agregar a carrito"
agregarAlCarrito(plan: any) {
  console.log('Agregar a carrito:', this.user);
  // Aquí puedes agregar la lógica para agregar al carrito
}



openRenovarModal(userId: string): void {
  if (this.modalOpened) return;

  // ✅ Verifica si hay planes antes de abrir el modal
  if (!this.plans || this.plans.length === 0) {
    console.warn('❗ No hay planes disponibles para mostrar en el modal.');
    return;
  }

  // ✅ Abre el modal con los planes que te pasan por @Input()
  const dialogRef = this.dialog.open(PlanModalComponent, {
    width: '400px',
    disableClose: true,
    data: {
      plans: this.plans, // <-- Usa el input
      userId: userId
    }
  });

  this.modalOpened = true;

  dialogRef.afterClosed().subscribe(result => {
    this.modalOpened = false;

    if (result) {
      console.log('✅ Plan seleccionado en el modal:', result);

      const membership: CartItemModel = {
        product: {
          id: Number(result.id),
          name: result.name,
          price: result.price,
          img: 'assets/membership.png',
          available: true,
          stock: 9999,
          isMembership: true,
          idClienteTOMembership: userId ? Number(userId) : 0 // 🔥 Si `userId` es `null`, se envía `0`
        },
        quantity: 1,
        total: result.price
      };

      console.log('📌 Agregando membresía al carrito:', membership);

      this._cartService.addItem(membership.product, membership.quantity);
    }
  });
}


retrySyncUnsyncedMembers() {
  console.log('🔄 Reintentando sincronización de miembros...');
  
}
}
