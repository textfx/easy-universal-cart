import React from 'react';
import {withCart} from '../../../cart/cart-driver'
import {connect} from 'react-redux';
import './product.css';

//images/catalog/HQ555_1.jpg
function Product({setOpen,cart, id, img, beforePrice, afterPrice, size,  currency = "UAH"}) {

    const buyNow = ()=> {
        cart.add({id, img,  size, price:afterPrice});
        setOpen(true);
    };

    return (
        <div className="product">
            <div><img src={img} alt=""/></div>

            <p className="sizes red font-23"><strong>Size: S, M </strong></p>
            <p className="sizes">Price <del>{beforePrice}</del> <strong className="font-23">{afterPrice} {currency}.</strong></p>

            <div className="center margin-25"><a href="#!" className="button-orange button-m" onClick={buyNow}>BUY NOW</a></div>

            <div className="clear"></div>
        </div>
    );
}

export default withCart(connect((state)=>({state}))(Product));