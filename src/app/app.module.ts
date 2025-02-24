import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';


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

import { ProductEffects } from './state/effects/product.effects';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { SocketProviderConnect } from 'src/shared/soket.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from './shared/shared-module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SlideComponent } from './shared/slide/slide.component';
import * as fromSaleDetail from './state/point-of-sale/sale-details/sale-detail.reducer';
import { SaleDetailEffects } from './state/point-of-sale/sale-details/sale-detail.effects';
import { SaleModule } from './state/point-of-sale/sale/sale.module';
import { CashRegisterModule } from './state/point-of-sale/cash-register/cash-register.module';
import { cashRegisterReducer } from './state/point-of-sale/cash-register/cash-register.reducer';
import { CashRegisterEffects } from './state/point-of-sale/cash-register/cash-register.effects';
import { CashierModule } from './state/point-of-sale/casher/cashier.module';
import { cashierReducer } from './state/point-of-sale/casher/cashier.reducer';
import { categoryReducer } from './state/reducers/category.reducer';
import { CategoryEffects } from './state/effects/category.effects';
import { detailProductReducer } from './state/reducers/product.reducer';
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

//const config: SocketIoConfig = { url: 'http://localhost:4200', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    HomeComponent,
    SlideComponent,

      ],
  imports: [
   
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModuleModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule,
    FormsModule,
    MatCheckboxModule,
   // SocketIoModule.forRoot(config),
    StoreModule.forRoot(ROOT_REDUCERS, {}),
    StoreDevtoolsModule.instrument({
      name:'test2'
    }),
    EffectsModule.forRoot([MemberEffects, ProductEffects,SaleDetailEffects,CashRegisterEffects]),
    ZXingScannerModule,
    StoreModule.forFeature(fromSaleDetail.saleDetailsFeatureKey, fromSaleDetail.saleDetailReducer),
    SaleModule,
    StoreModule.forFeature('cashRegisters', cashRegisterReducer), // Registro del feature store
    CashRegisterModule,
    CashierModule,
    StoreModule.forFeature('cashers', cashierReducer), // Registro del feature store
    StoreModule.forFeature('category', categoryReducer),
    StoreModule.forFeature('detail', detailProductReducer),
    StoreModule.forFeature('routine', routinesReducer), // El nombre debe ser 'routine'
    EffectsModule.forFeature([RoutinesEffects]),
    StoreModule.forFeature('promotions', promotionReducer), // Register Redux store for promotions
    EffectsModule.forFeature([PromotionEffects]), // Register Redux effects for promotions
    EffectsModule.forFeature([CategoryEffects]),
    StoreModule.forFeature('roles', roleReducer), // ✅ Ensure this matches 'createFeatureSelector'
    EffectsModule.forFeature([RoleEffects]),
    StoreModule.forFeature('permissions', permissionReducer),
    EffectsModule.forFeature([PermissionEffects]),
    StoreModule.forFeature('plan', planReducer),
    EffectsModule.forFeature([PlanEffects]),

  ],
  
  providers: [NotificationService,
    //SocketProviderConnect,
  ],
  schemas: [NO_ERRORS_SCHEMA], // Agrega esta línea

  bootstrap: [AppComponent],
})
export class AppModule { }
