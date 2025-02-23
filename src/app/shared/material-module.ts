import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDatepickerModule} from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@NgModule({
  exports: [
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatMenuModule,
    MatGridListModule,
    MatRadioModule,
    MatDividerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,MatIconModule,MatInputModule,MatButtonModule,MatDialogModule,MatDatepickerModule,
    MatIconModule,MatFormFieldModule,FormsModule,MatInputModule,MatButtonModule,MatDialogModule,MatDatepickerModule
    ,MatChipsModule
  ],
  providers:[{
    provide: MatDialogRef,
    useValue: {}
  },]
})
export class CustomMaterialModule { }
