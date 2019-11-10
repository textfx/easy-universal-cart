import React from 'react';
import Simple from './simple/simple';
import Design from "./design/design";
import MyFirstRender from './readme/my-first-render'

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {Provider} from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import cartReducer from '../cart/cart-reducer';
import {Cart} from '../cart/cart-driver';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
/*JSON.parse(localStorage.getItem('cart')), */
const store = createStore(cartReducer, composeWithDevTools(applyMiddleware(thunk)));
Cart(store);

export default function App() {
    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route  path="/readme" render={MyFirstRender} />
                    <Route  path="/" render={({location:{search}})=>search.indexOf("page=design") !==-1 ? <Design /> : <Simple />} />
                </Switch>
            </Router>
        </Provider>
    );
}