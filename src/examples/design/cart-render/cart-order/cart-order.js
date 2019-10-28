import React from 'react';
import {withCart} from '../../../../cart/cart'
import './cart-order.css'

function CartOrder({onBack, cart, display=false}) {
    return(
        <div className="noselect" style={{display : display? "contents" : "none"}}>
        <div className="container-2 noselect">

            <a onClick={()=>onBack(true)} className="btn-back">
                <i className="fas fa-arrow-alt-circle-left"></i>
            </a>

            <div className="order">
                <p className="center" style={{paddingTop: "10px"}}>
                    <strong>Leave a request</strong><br/>
                    And we will contact you to find out the details
                </p>

                <form onSubmit={(e)=>{cart.submitClear()}} style={{paddingTop: "15px"}} action="http://pars.ru/js2019/react/easy-universal-cart/public/server.php" method="post">
                    {cart.getInput()}
                    <input type="hidden" name="relead" value=" " />
                    <input type="text" name="name"  placeholder="Full name" required="" />
                    <input type="text" name="phone" placeholder="Phone +38(095)-111-11-11" required=""/>

                    <div className="checkbox">
                        <input id="bank" type="checkbox" name="bank" value="Pay by credit card"/>
                        <label htmlFor="bank" className="bank">Pay by credit card</label>
                    </div>

                    <div className="center order">
                        <button className="button-orange">Order</button>
                    </div>
                </form>
            </div>

        </div>
        </div>
    );
}

export default withCart(CartOrder);