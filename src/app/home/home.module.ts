import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {  HomeRoutingModule } from './home-routing.module';
import { FingerPrintComponent } from './finger-print/finger-print.component';
import { AuthFaceComponent } from './auth-face/auth-face.component';
import { CustomMaterialModule } from '../shared/material-module';
import { RouterModule } from '@angular/router';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { UsuarioModule } from './user/user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../shared/notification.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductModule } from './product/product.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { VideoIAComponent } from './auth-face/video-ia/video-ia.component';
import { ImageCaptureIaComponent } from './auth-face/image-capture-ia/image-capture-ia.component';
import { ImageResultCheckComponent } from './auth-face/image-result-check/image-result-check.component';
import { TypeAuthenticationComponent } from './auth-face/type-authentication/type-authentication.component';
import { SharedModule } from '../shared/shared-module';
import { PointOfSaleModule } from './point-of-sale/point-of-sale.module';
import { AgendaModule } from '../agenda/agenda.module';



@NgModule({
  declarations: [
    FingerPrintComponent,
    AuthFaceComponent, 
    ConfigurationComponent,
    VideoIAComponent, 
    ImageCaptureIaComponent, 
    ImageResultCheckComponent,
    
],
  providers:[NotificationService],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule,
    MaterialModuleModule,
    HomeRoutingModule,
    UsuarioModule,
    FormsModule,
    
    ReactiveFormsModule,
    DatePipe,
    MatFormFieldModule,
    TypeAuthenticationComponent,
    ProductModule,
    PointOfSaleModule,
    AgendaModule
  ]
  
})
export class HomeModule { }
