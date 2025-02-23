import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import { MatExpansionModule } from '@angular/material/expansion'; // 🔥 Importar módulo








@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,MatButtonModule,
    MatSnackBarModule,
            MatInputModule,
            MatSlideToggleModule,
            MatCardModule,
            MatFormFieldModule,
            MatMenuModule,
            MatIconModule,
            MatToolbarModule,
            MatSortModule,
            MatPaginatorModule,
            MatDatepickerModule,
            MatRadioModule,
            MatGridListModule,
            MatSelectModule,
            MatNativeDateModule,
            MatDialogModule,
            MatButtonModule,
            MatButtonToggleModule,
            MatCardModule,
            MatIconModule,MatExpansionModule 
            
    
  ],
  exports:[ 
    MatTableModule,MatButtonModule,
    MatSnackBarModule,
            MatInputModule,
            MatSlideToggleModule,
            MatCardModule,
            MatFormFieldModule,
            MatMenuModule,
            MatIconModule,
            MatToolbarModule,
            MatSortModule,
            MatPaginatorModule,
            MatDatepickerModule,
            MatRadioModule,
            MatGridListModule,
            MatSelectModule,
            MatNativeDateModule,
            MatDialogModule,
            MatButtonToggleModule,
            MatIconModule,MatExpansionModule 
            
          ],
})
export class MaterialModuleModule { }
