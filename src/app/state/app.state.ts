import { ActionReducerMap } from '@ngrx/store';
import { MemberState } from '../core/models/member.state';
import { MemberReducer } from './member/member.reducer';
import { detailProductReducer, ProductReducer } from './product/product.reducer';
import { HuellaReducer } from './reducers/huella.reducer';

import {  ProductState } from '../core/models/product.state';
import { HuellaState } from '../core/models/huella.state';
import { UserState } from '../core/models/user.state';
import { UserReducer } from './reducers/deleteuser.reducer';
import { cartReducer } from './point-of-sale/cart/cart.reducer';
import { CartState } from '../core/models/cart.state';
import { categoryReducer, CategoryState } from './reducers/category.reducer';
import { DetailProductState } from '../core/models/detail-product.state';
import { CashRegisterState } from './point-of-sale/cash-register/cash-register.state';
import { SaleState } from './point-of-sale/sale/sale.state';
import { cashRegisterReducer } from './point-of-sale/cash-register/cash-register.reducer';
import { salesReducer } from './point-of-sale/sale/sale.reducer';
import { UserSessionState } from './user/session/user-session.state';
import { userSessionReducer } from './user/session/user-session.reducer';
import { ExpenseReducer, ExpenseState } from './expense/expense.reducer';
import { checkinReducer } from './checkins/checkins.reducer';
import { CheckinState } from './checkins/checkin.state';


export interface AppState {
    members: MemberState;
    products: ProductState;
    id: HuellaState;
    user: UserState;
    cart: CartState;
    categories: CategoryState;
    detail: DetailProductState;
    cashRegister: CashRegisterState;  // ✅ agregados
    sales: SaleState;  
    userSession: UserSessionState;
      expense: ExpenseState;
  checkins: CheckinState; // ✅ AÑADIDO AQUÍ

                  // ✅ agregados
}
export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
    members: MemberReducer,
    products: ProductReducer,
    id: HuellaReducer,
    user: UserReducer,
    cart: cartReducer,
    categories: categoryReducer,
    detail: detailProductReducer,
    cashRegister: cashRegisterReducer, // ✅ agregado
    sales: salesReducer,
    userSession: userSessionReducer,
      expense: ExpenseReducer, // ✅ AGREGA ESTA LÍNEA

  checkins: checkinReducer // ✅ AÑADIDO AQUÍ

};
