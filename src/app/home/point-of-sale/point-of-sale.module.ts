import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfSaleComponent } from './point-of-sale.component';
import { PointOfSaleService } from './point-of-sale.service';
import { PointOfSaleRoutingModule } from './point-of-sale-routing.module';
import { SalesComponent } from './sales/sales.component';
import { SubareaTituloComponent } from 'src/app/shared/subarea-titulo/subarea-titulo.component';
import { ReportComponent } from './report/report.component';
import { GraphsComponent } from './graphs/graphs.component';
import { TableMaterialComponent } from 'src/app/shared/table-material/table-material.component';
import { AddButtonComponent } from "../../shared/add-button/add-button.component";
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { MatTableModule } from '@angular/material/table';
import { PromotionDetailsComponent } from './promotion/promotion-details/promotion-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesModule } from './roles/roles.module';
import { TableMaterialCrudComponent } from "../../shared/table-material-crud/table-material.component";
import { NgChartsModule } from 'ng2-charts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MachineFormComponent } from '../machine/machine-form/machine-form.component';
import { MachineContainerComponent } from '../machine/machine-container.component.';
import { QRCodeModule } from 'angularx-qrcode';
import { QrModalComponent } from '../machine/qr-modal/qr-modal.component';
import { QrCardComponent } from '../machine/machine-form/shared/qr-card/qr-card.component';
import { CtnCreateSearchComponent } from './components/components/ctn-create-search/ctn-create-search.component';
import { MachineListComponent } from '../machine/machine-list/machine-list.component';
import { SearchCreateListComponent } from './components/search-create-list/search-create-list.component';



@NgModule({
  declarations: [
    PointOfSaleComponent,

    ReportComponent,
    GraphsComponent,
    PromotionDetailsComponent,
    MachineContainerComponent,
    MachineFormComponent,
    QrModalComponent,
    MachineListComponent


  ],
  imports: [
    SearchCreateListComponent,
    CtnCreateSearchComponent,
    CommonModule,
    RolesModule,
    MatTableModule,
    PointOfSaleRoutingModule,
    NgChartsModule,
    SubareaTituloComponent,
    AddButtonComponent,
    MaterialModuleModule,
    TableMaterialComponent,
    MatTableModule,
    FormsModule,
    TableMaterialCrudComponent,
    MatCheckboxModule,
    ReactiveFormsModule,
    QRCodeModule,
    QrCardComponent // ✅ importa aquí el componente standalone
    ,
],
  providers:[PointOfSaleService]
})
export class PointOfSaleModule { }
