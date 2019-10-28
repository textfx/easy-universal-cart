import React from 'react';
import Simple from './simple/simple';
import Design from "./design/design";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Provider} from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import {cartReducer, Cart} from '../cart/cart';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';


const store = createStore(cartReducer,JSON.parse(localStorage.getItem('cart')), composeWithDevTools(applyMiddleware(thunk)));
Cart(store);

export default function App(props) {
    return (
        <Provider store={store}>
            <Router>
                    <Route  path="/" render={({location:{search}})=>search.indexOf("page=design") !=-1 ? <Design /> : <Simple />} />
            </Router>
        </Provider>
    );
}