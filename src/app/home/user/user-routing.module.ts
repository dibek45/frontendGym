import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserTableComponent } from './user-table/user-table.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { AuthGuard } from 'src/app/auth/auth.guard';


const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
        children: [
                    {
                      path: 'new-user', // child route path
                      component: CreateFormComponent, // child route component that the router renders
                    },
                    {
                      path: 'table', // child route path
                      component: UserTableComponent,canActivate: [AuthGuard] ,
                      children: [
                       
                        // Puedes agregar más rutas secundarias aquí según tus necesidades
                      ], // child route component that the router renders
                    },
                    {
                      path: 'profile/:id',  // Child route with dynamic param 'id'
                      component: UserFormComponent,  // Component to be displayed for this route
                    },
          ], 
    },
  
  // Otras rutas y componentes relacionados del módulo
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class userRoutesRoutingModule { }
