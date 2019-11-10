import React from 'react';
import {withCart} from '../../../../cart/cart-driver'
import './cart-order.css'

const CartOrder = React.memo(({onBack, cart:{submitClear, getInput}, display=false}) => {
    return(
        <div className="noselect" style={{display : display? "contents" : "none"}}>
        <div className="container-2 noselect">

            <a href="#!" onClick={()=>onBack(true)} className="btn-back">
                <i className="fas fa-arrow-alt-circle-left"></i>
            </a>

            <div className="order">
                <p className="center" style={{paddingTop: "10px"}}>
                    <strong>Leave a request</strong><br/>
                    And we will contact you to find out the details
                </p>

                <form onSubmit={()=>{submitClear();}} style={{paddingTop: "15px"}} action="https://euc-testpost.000webhostapp.com/server.php" method="post">
                    {getInput()}
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
});
CartOrder.whyDidYouRender = true;
export default withCart(CartOrder);