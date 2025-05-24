import { NO_ERRORS_SCHEMA, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';

import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es-MX');

import { MenuComponent } from './menu/menu.component';

import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from './shared/notification.service';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ROOT_REDUCERS } from './state/app.state';
import { EffectsModule } from '@ngrx/effects';
import { MemberEffects } from './state/member/member.effects';

import { ProductEffects } from './state/product/product.effects';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { SocketProviderConnect } from 'src/shared/soket.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from './shared/shared-module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SlideComponent } from './shared/slide/slide.component';

import { SaleModule } from './state/point-of-sale/sale/sale.module';
import { CashRegisterModule } from './state/point-of-sale/cash-register/cash-register.module';
import { cashRegisterReducer } from './state/point-of-sale/cash-register/cash-register.reducer';
import { CashRegisterEffects } from './state/point-of-sale/cash-register/cash-register.effects';
import { CashierModule } from './state/point-of-sale/casher/cashier.module';
import { cashierReducer } from './state/point-of-sale/casher/cashier.reducer';
import { categoryReducer } from './state/reducers/category.reducer';
import { CategoryEffects } from './state/effects/category.effects';
import { detailProductReducer } from './state/product/product.reducer';
import { routinesReducer } from './state/point-of-sale/routines/routines.reducer';
import { RoutinesEffects } from './state/point-of-sale/routines/routines.effects';
import { PromotionEffects } from './state/promotions/promotion.effects';
import { promotionReducer } from './state/promotions/promotion.reducer';
import { RoleEffects } from './state/roles/rol.effects';
import { roleReducer } from './state/roles/rol.reducer';
import { PermissionEffects } from './state/roles/permission/permission.effects';
import { permissionReducer } from './state/roles/permission/permission.reducer';
import { PlanEffects } from './state/plan/plan.effects';
import { planReducer } from './state/plan/plan.reducer';
import { MachineEffects } from './state/machine/machine.effects';
import { machineReducer } from './state/machine/machine.reducer';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { localStorageMetaReducer } from './local/services/meta-reducers/local-storage-meta.reducer';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
//const config: SocketIoConfig = { url: 'http://localhost:4200', options: {} };

 




@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    HomeComponent,
    SlideComponent
      ],
 imports: [
  CommonModule,
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  MatTableModule,
  MatCheckboxModule,
  MatSidenavModule,
  ZXingScannerModule,
  MaterialModuleModule,
  SharedModule,
  SaleModule,
  CashRegisterModule,
  CashierModule,

  // ✅ NgRx: primero el StoreModule.forRoot
  StoreModule.forRoot(ROOT_REDUCERS, {
    metaReducers: [localStorageMetaReducer]
  }),

  // ✅ Luego todos los feature reducers
  StoreModule.forFeature('cashRegisters', cashRegisterReducer),
  StoreModule.forFeature('cashers', cashierReducer),
  StoreModule.forFeature('category', categoryReducer),
  StoreModule.forFeature('detail', detailProductReducer),
  StoreModule.forFeature('routine', routinesReducer),
  StoreModule.forFeature('promotions', promotionReducer),
  StoreModule.forFeature('roles', roleReducer),
  StoreModule.forFeature('permissions', permissionReducer),
  StoreModule.forFeature('plan', planReducer),
  StoreModule.forFeature('machines', machineReducer),

  // ✅ Effects
  EffectsModule.forRoot([
    MemberEffects,
    ProductEffects,
    CashRegisterEffects
  ]),
  EffectsModule.forFeature([
    RoutinesEffects,
    PromotionEffects,
    CategoryEffects,
    RoleEffects,
    PermissionEffects,
    PlanEffects,
    MachineEffects
  ]),

  // ✅ Devtools
  StoreDevtoolsModule.instrument({
    name: 'test2'
  }),

  // ✅ PWA
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  })
],

  
  providers: [
    NotificationService,
    
    HttpLink, // <-- ⚠️ Esto es lo que te falta
    
     
    //SocketProviderConnect,
  ],
  schemas: [NO_ERRORS_SCHEMA], // Agrega esta línea

  bootstrap: [AppComponent],
})
export class AppModule { }
