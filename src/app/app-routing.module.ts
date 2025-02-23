import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [
  
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }

  //{ path: 'usuario', component: UsuarioComponent },

  // Otras rutas de tu aplicación
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
