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
import { MainScreenComponent } from './main-screen/main-screen.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: MainScreenComponent,
      },
      {
        path: 'main-screen',
        component: MainScreenComponent, // ✅ Nueva ruta añadida
      },
      {
        path: 'agenda',
        component: AgendaComponent
      },
      // ...
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
