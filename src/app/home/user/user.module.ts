import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserComponent } from './user.component';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { FlexLayoutModule } from '@angular/flex-layout';

import { userRoutesRoutingModule } from './user-routing.module';
import { UserTableComponent } from './user-table/user-table.component';
import { AddphotoModule } from 'src/app/shared/addphoto/addphoto.module';
import { PhotoComponent } from 'src/app/shared/photo/photo.component';
import { CardComponent } from 'src/app/shared/card/card.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { RegisterHuellaComponent } from './create-form/register-huella/register-huella.component';
import { UserFormComponent } from './user-form/user-form.component';
import { DialogRegistroCompletadoComponent } from './dialog-registro-completado/dialog-registro-completado.component';
import { MemberService } from 'src/app/state/member/member.service';

  

@NgModule({
  declarations: [
    CreateFormComponent,UserFormComponent,UserComponent, UserTableComponent, DialogRegistroCompletadoComponent
  ],

  imports: [
    userRoutesRoutingModule,
    CommonModule,
    MaterialModuleModule,
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule, PhotoComponent, CardComponent,
    RegisterHuellaComponent,
    
],
  exports:[],
  providers:[MemberService,DatePipe,NotificationService]
})
export class UsuarioModule { }
