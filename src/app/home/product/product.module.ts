import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WebcamModule } from 'ngx-webcam';
import { PhotoComponent } from 'src/app/shared/photo/photo.component';
import { productRoutesRoutingModule } from './product-routing.module';
import { ProductTableComponent } from './product-table/product-table.component';
import { TableMaterialComponent } from 'src/app/shared/table-material/table-material.component';
import { CardProductComponent } from 'src/app/shared/card-product/card-product.component';
import { ProductService } from '../../state/product/product.service';
import { SharedModule } from 'src/app/shared/shared-module';
import { DragOverComponent } from "../../shared/drag-over/drag-over.component";

  


@NgModule({
  declarations: [
    ProductFormComponent,ProductComponent,ProductTableComponent

  ],
  imports: [
    CommonModule, CardProductComponent,
    TableMaterialComponent,
    MaterialModuleModule,
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule, WebcamModule, PhotoComponent, PhotoComponent,
    productRoutesRoutingModule,
    SharedModule,
    DragOverComponent
    
],
  providers:[ProductService]
})
export class ProductModule { }
