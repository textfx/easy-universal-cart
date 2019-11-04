import React from 'react';
import {withCart} from '../../../../cart/cart-driver';
import "./cart-item.css";
import {surprise} from "../../../simple/simple";


function CartItem(props){
    const {id, img, name, size, price, discount, count, currentSize, cart,  currency = "UAH"} = props;
    const gift = id === "gift";
    let select;

    if (size)
        select = <select className="font-14" value={currentSize} required onChange={({target : t})=>cart.set({id, currentSize: t.options[t.selectedIndex].value})}>
            {size.map((val)=><option key={val} >{val}</option>)}
        </select>;

    if (gift)
        select = <select className="font-14" value={name} required onChange={({target : t})=>surprise(t.options[t.selectedIndex].value)}>
            {["cap", "gaiters", "gloves"].map((val, index)=><option key={val}  value={val}>{index}</option>)}
        </select>;

    const dec = ()=>cart.dec({id:id, count:1}),
          inc = ()=>cart.inc({id:id, count:1}),
          remove = ()=>cart.remove(id),
          item = (<>
                <td>
                    <a href="#!" onClick={dec}><i className="fa fa-angle-left"></i></a>
                    <span className="count" >{count}</span>
                    <a href="#!" onClick={inc}><i className="fa fa-angle-right"></i></a>
                </td>
                <td>{cart.discount(price, count, discount)} <br /> {currency}</td>
                <td>
                    <a href="#!" onClick={remove}><i className="fa fa-trash red font-24"></i></a>
                </td>
            </>);

    return (
        <tr>
            <td>{gift ? null : id}</td>
            <td><img src={img} alt=""/></td>
            <td>{select}</td>
            {!gift
                ? item
                : <td colSpan={3} className="gift"><span className="red">FREE GIFT</span> <p style={{paddingTop: "10px"}}>{name.toUpperCase()}</p></td>
            }
        </tr>);
}

export default withCart(CartItem);