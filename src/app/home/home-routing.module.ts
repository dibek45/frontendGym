import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthFaceComponent } from './auth-face/auth-face.component';
import { FingerPrintComponent } from './finger-print/finger-print.component';
import { UserComponent } from './user/user.component';
import { ProductComponent } from './product/product.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { VideoIAComponent } from './auth-face/video-ia/video-ia.component';
import { AuthGuard } from '../auth/auth.guard';
import { PointOfSaleComponent } from './point-of-sale/point-of-sale.component';
import { AgendaComponent } from '../agenda/component/agenda.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
        children: [
                    {
                      path: '',
                      component: UserComponent, 
                    },
                  
                    {
                      path: 'agenda',
                      component: AgendaComponent
                    },
                    {
                      path: 'user',
                      component: UserComponent// another child route component that the router renders
                    },
                    {
                      path: 'auth-face', // child route path
                      component: AuthFaceComponent,canActivate: [AuthGuard]  // child route component that the router renders
                    },
                    {
                      path: 'finger-print',
                      component: FingerPrintComponent, canActivate: [AuthGuard] // another child route component that the router renders
                    },
                    {
                      path: 'product',
                      component: ProductComponent,canActivate: [AuthGuard] },
                    {
                      path: 'camera-video',
                      component: VideoIAComponent, canActivate: [AuthGuard] // another child route component that the router renders
                    },
                    {
                      path: 'administration',
                      component: PointOfSaleComponent // another child route component that the router renders
                    }
        ], 
  },
  
  // Otras rutas y componentes relacionados del módulo
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
