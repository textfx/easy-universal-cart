import React from 'react';
import {useCart} from '../../../cart/cart-driver'
import './product.css';

const Product = React.memo(({setOpen, id, img, beforePrice, afterPrice, size,  currency = "UAH"}) => {
    const {add} = useCart();

    const buyNow = ()=> {
        add({id, img,  size, price:afterPrice});
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
});
Product.whyDidYouRender = true;
export default Product;


//export default withCart(Product);
//export default withCart(connect((state)=>state)(Product));