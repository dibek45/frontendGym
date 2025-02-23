import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { CartComponent } from './cart/cart.component';


const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent,
        children: [
                    {
                      path: 'new-product', // child route path
                      component: ProductFormComponent, // child route component that the router renders
                    },
                    {
                      path: 'table',
                      component: ProductTableComponent, // another child route component that the router renders
                    },
                    {
                      path: 'cart',
                      component: CartComponent, // another child route component that the router renders
                    },
        ], 
  },
  
  // Otras rutas y componentes relacionados del módulo
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class productRoutesRoutingModule { }
