import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { RolesComponent } from './roles.component';
import { RolesService } from './roles.service';
import { MatDialogModule } from '@angular/material/dialog';
import { RoleDialogComponent } from './role-dialog.component';
import { PermissionsModule } from './permissions.module';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    RolesComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    HttpClientModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    PermissionsModule,
    MaterialModuleModule,
    
  ],
  providers: [RolesService],
  exports: [RolesComponent]
})
export class RolesModule {}
