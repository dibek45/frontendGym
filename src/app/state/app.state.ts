import { ActionReducerMap } from '@ngrx/store';
import { MemberState } from '../core/models/member.state';
import { MemberReducer } from './reducers/member.reducer';
import { detailProductReducer, ProductReducer } from './reducers/product.reducer';
import { HuellaReducer } from './reducers/huella.reducer';

import {  ProductState } from '../core/models/product.state';
import { HuellaState } from '../core/models/huella.state';
import { UserState } from '../core/models/user.state';
import { UserReducer } from './reducers/user.reducer';
import { cartReducer } from './reducers/cart.reducer';
import { CartState } from '../core/models/cart.state';
import { categoryReducer, CategoryState } from './reducers/category.reducer';
import { DetailProductState } from '../core/models/detail-product.state';

export interface AppState{
    members: MemberState;
    products:ProductState,
    id:HuellaState,
    user:UserState,
    cart:CartState,
    categories:CategoryState
    detail: DetailProductState;
}
export const ROOT_REDUCERS:ActionReducerMap<AppState> = {
        members: MemberReducer,
        products : ProductReducer,
        id:HuellaReducer,
        user:UserReducer,
        cart:cartReducer,
        categories:categoryReducer,
        detail:detailProductReducer
}