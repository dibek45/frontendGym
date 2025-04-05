import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfSaleComponent } from './point-of-sale.component';
import { PointOfSaleService } from './point-of-sale.service';
import { PointOfSaleRoutingModule } from './point-of-sale-routing.module';
import { HorizontalMenuComponent } from 'src/app/menu/horizontal-menu-dump/horizontal-menu.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';
import { SalesComponent } from './sales/sales.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SubareaTituloComponent } from 'src/app/shared/subarea-titulo/subarea-titulo.component';
import { MembershipPaymentComponent } from './membership-payment/membership-payment.component';
import { ReportComponent } from './report/report.component';
import { GraphsComponent } from './graphs/graphs.component';
import { PromotionComponent } from './promotion/promotion.component';
import { TableMaterialComponent } from 'src/app/shared/table-material/table-material.component';
import { AddButtonComponent } from "../../shared/add-button/add-button.component";
import { CardCashRegisterItemComponent } from './cash-register/shared/card-cash-register-item/card-cash-register-item.component';
import { AddCashRegisterComponent } from './cash-register/shared/add-cash-register/add-cash-register.component';
import { CasherComponent } from './casher/casher.component';
import { AddCasherComponent } from "./casher/shared/add-casher/add-casher.component";
import { CardCasherComponent } from "./casher/shared/card-casher/card-casher.component";
import { RoutinesComponent } from './routines/routines.component';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { MatTableModule } from '@angular/material/table';
import { PromotionDetailsComponent } from './promotion/promotion-details/promotion-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesModule } from './roles/roles.module';
import { TableMaterialCrudComponent } from "../../shared/table-material-crud/table-material.component";
import { NgChartsModule } from 'ng2-charts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MachineFormComponent } from '../machine/machine-form/machine-form.component';
import { MachineListComponent } from '../machine/machine-list/machine-list.component';
import { MachineContainerComponent } from '../machine/machine-container.component.';
import { QRCodeModule } from 'angularx-qrcode';
import { QrModalComponent } from '../machine/qr-modal/qr-modal.component';
import { QrCardComponent } from '../machine/machine-form/shared/qr-card/qr-card.component';



@NgModule({
  declarations: [
    PointOfSaleComponent,
    CashRegisterComponent,
    SalesComponent,
    ExpensesComponent,
    MembershipPaymentComponent,
    ReportComponent,
    GraphsComponent,
    PromotionComponent,
    CasherComponent,
    RoutinesComponent,
    PromotionDetailsComponent,
    MachineContainerComponent,
    MachineListComponent,
    MachineFormComponent,
    QrModalComponent 


  ],
  imports: [
    CommonModule,
    RolesModule,
    MatTableModule,
    PointOfSaleRoutingModule,
    NgChartsModule,
    HorizontalMenuComponent,
    SubareaTituloComponent,
    AddButtonComponent,
    CardCashRegisterItemComponent,
    AddCashRegisterComponent,
    AddCasherComponent,
    CardCasherComponent,
    MaterialModuleModule,
    TableMaterialComponent,
    MatTableModule,
    FormsModule,
    TableMaterialCrudComponent,
    MatCheckboxModule,
    ReactiveFormsModule,
    QRCodeModule,
    QrCardComponent  // ✅ importa aquí el componente standalone

    
],
  providers:[PointOfSaleService]
})
export class PointOfSaleModule { }
