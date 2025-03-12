import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointOfSaleComponent } from './point-of-sale.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';
import { SalesComponent } from './sales/sales.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { MembershipPaymentComponent } from './membership-payment/membership-payment.component';
import { ReportComponent } from './report/report.component';
import { GraphsComponent } from './graphs/graphs.component';
import { PromotionComponent } from './promotion/promotion.component';
import { CasherComponent } from './casher/casher.component';
import { RoutinesComponent } from './routines/routines.component';
import { RolesComponent } from './roles/roles.component';

const routes: Routes = [
  {
    path: 'administration',
    component: PointOfSaleComponent,
    children:[
      {
      path: 'cash-register', 
      component: CashRegisterComponent, 
      },
      {
        path: 'sales', 
        component: SalesComponent, 
      },
      {
        path: 'exponses', 
        component: ExpensesComponent, 
      },
      {
        path: 'MembershipPayment', 
        component: MembershipPaymentComponent, 
      },
   
      {
        path: 'Reports', 
        component: ReportComponent, 
      },
      {
        path: 'Graphs', 
        component: GraphsComponent, 
      },
      {
        path: 'Promotions', 
        component: PromotionComponent, 
      },
      {
        path:'Cajeros',
        component:CasherComponent
      },
      {
        path:'Routines',
        component:RoutinesComponent
      },
      {
        path:'roles',
        component:RolesComponent
      }

      
  ], 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PointOfSaleRoutingModule {}
