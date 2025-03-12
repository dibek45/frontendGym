import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../home/product/cart/cart.component';
import { RightSectionComponent } from "../home/product/cart/right-section/right-section.component";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CartComponent],  // Declara el CartComponent
  imports: [
    FormsModule,
    CommonModule ,
    RightSectionComponent
],
  exports: [CartComponent]  // Exporta el CartComponent para que pueda ser usado en otros módulos
})
export class SharedModule {}