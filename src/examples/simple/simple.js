import React from 'react';
import SimpleItems from './simple-items';
import './simple.css';
import {cart, withCart} from '../../cart/cart';
import {connect} from 'react-redux';
import Surprice from "./simple-surprice";
import {Link} from "react-router-dom";

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function surprise(id, display) {
    switch (id) {
        case "cap":
            cart.add({id:"gift", uid:1111, name:"cap", img:"./img/gifts/1.jpg", count:1, fixCount:true, gift:true, position:"last",  price:0,  discount:{5:50, 10:90}, valuta:"grn"});
            break;
        case "gaiters":
            cart.add({id:"gift", uid:2222, name:"gaiters", img:"./img/gifts/2.jpg", count:1, fixCount:true, gift:true, position:"first", price:0,  discount:{5:50, 10:90}, valuta:"grn"});
            break;
        case "gloves":
            cart.add({id:"gift",  uid:3333, name:"gloves", img:"./img/gifts/3.jpg", count:1, fixCount:true, gift:true, position:"last",  price:0,  discount:{5:50, 10:90}, valuta:"grn"});
            break;
    }

}


function Simple({state, cart}) {
    // price:cart.roundMagic(cart.discount(853.5, 1, 10)), disсount:{1:10, 5:50}  price  это настоящая цена
    const addDiscount = ()=>cart.add({id:getRandom(1,19), img:"./img/catalog/"+getRandom(1,19)+".jpg", size:["xs","m","l"], currentSize:"xs",  price:{1:853.5, 5:500},  discount:{5:50, 10:90}, valuta:"grn"});
    const addMagic = ()=>cart.add({id:getRandom(1,19), img:"./img/catalog/"+getRandom(1,19)+".jpg", size:["xs","m","l"], currentSize:"xs", magic:"Magic", price:cart.roundMagic(853.5), discount:{5:50, 10:90}, valuta:"grn"});

    const sum = cart.sumPrice('price');
                cart.setForm("delivery", (sum>3000) ? "free" : "pay");

    return(
        <div className="simple noselect">
            <Link to="./?page=design" style={{"color":"red"}}>Switch to DESIGN>>></Link><br /><br />

            {/* MENU */}
            <a onClick={addDiscount}>add-853.5-(discount)</a>
            <a onClick={addMagic}>add-853.5-(roundMagic)</a>
            <a onClick={()=>cart.clear()}>CLEAR</a>
            <a onClick={()=>cart.clearLocalState()}>   clearLocalState</a>


            {/* FORM */}
            <br /><br />
            {/* В реальном проекте, пользователь не должен видеть форму отправки, если корзина пуста! Или нужна дополнительная проверка с очисткой данных из cart.getInput()*/}
            In a real project, the user should not see the form if the cart is empty!
            <form  onSubmit={(e)=>{cart.submitClear();}} action="http://pars.ru/js2019/react/easy-universal-cart/public/server.php" method="POST">
                <input type="text" name="name" required placeholder="Yurii" />
                <input type="text" name="phone" required placeholder="+11111111111" />
                <input type="submit" value="POST request" />



            {/* SURPRISE */}
            <Surprice surprise={surprise} />


            {/* CART */}
            <div className="cart">
                <h1>CART</h1>
                <div> count>5 then price === 500UAH </div>
                <div> count(in item) > 5 === 50% discount </div>
                <div style={{"marginBottom":"10px"}}> count(in item) > 10 === 90% discount</div>
                Total: {sum} {(sum>3000) ?  <span style={{color:"red"}}>FREE SHIPPING</span>: null}
            </div>
            <table className="table">
                <tbody>
                    <SimpleItems sum={sum}/>
                </tbody>
            </table>

                {/* NOTE! Update your form must be in the last place or your data will be outdated. */}
                <div id="post">{cart.getInput()}</div>
            </form>

        </div>);

}
export default withCart(connect((state)=>({state}))(Simple));