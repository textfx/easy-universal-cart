import {connect} from 'react-redux';
import React from 'react';
import {withCart} from '../../cart/cart-driver';
import {Link} from "react-router-dom";

function MyFirstRender({state, cart}) {
    const sum = cart.sumPrice("price");

    const items = state.map((item) => {
        const {id, name, price, count, discount} = item;

        const dec = <button  type="button" onClick={()=>cart.dec({id, count:1})}>-</button>;
        const inc = <button  type="button" onClick={()=>cart.inc({id, count:1})}>+</button>;
        const remove = <a href="#!" onClick={()=>cart.remove(id)}>Remove</a>
        const currentPrice = cart.discount(price, count, discount);

        return (
            <div key={id}>
                {id} {name} {dec} {count} {inc} {currentPrice} {remove}
            </div>
        );
    });

    return <>
        <Link to="./">Simple</Link><br /><br />
        <button style={{margin: "10px"}} onClick={()=>cart.add({id:1, name:"myFirstItem", price:20})}>Add firstItem</button>
        <button onClick={()=>cart.add({id:2, name:"mySecondItem", price:10})}>Add secondItem</button><br/>

        Total: {sum}
        {items}
    </>
}

export default withCart(connect((state)=>({state}))(MyFirstRender));