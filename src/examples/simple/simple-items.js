import React from 'react';
import {connect} from 'react-redux';
import {withCart} from '../../cart/cart-driver'
import {surprise} from "./simple";

function SimpleItems({state, cart, sum}) {
    // Give or Remove Gift
    cart.toggle((sum>3000||state.length>(!cart.is("gift") ? 2 : 3)), "gift", ()=>surprise('cap'));

    return state.map((props) => {
        const {id, img, size, price, count, gift, fixCount,  currentSize, discount, magic} = props;       //props === cart.add({id:1, img:..., size:"x"})

        //Уведомление о скидке на позицию товара
        let oldPrice, disProcent, save, dis = cart.current(count, discount);
        if (dis) {
            oldPrice    = <span className='strikethrough'>{cart.discount(price, count)}</span>;
            disProcent  = <span style={{"color": "red"}}>-{dis}%</span>;
            save        = <span><span style={{"fontWeight": "bold"}}>You save:</span> {cart.save(price, count, discount)} UAH.</span>
        }

        //Save price with discount
        cart.setLocal(id, {price_discount: cart.discount(price, count, discount)});
        const itmePrice = <>{magic} {oldPrice} { gift ? <span style={{color:"red"}}>FREE</span> : cart.discount(price, count, discount)+" UAH."} {disProcent} {save}</>;

        return (
            <tr key={id}>
                <th scope="row">{id}</th>
                <td><img alt="" src={img} width="25px" height="38px"/></td>
                <td>
                    {(size) ? <select value={currentSize} required onChange={(e)=>cart.set({id:id, currentSize:e.target.options[e.target.selectedIndex].value})}>
                                {size.map((size)=><option value={size}  key={size}>{size}</option>)}
                              </select>
                            : null}
                </td>
                <td> {/*fixCount можно делать двумя способами*/}
                    <button  type="button"  disabled={fixCount} onClick={()=>cart.dec({id:id, count:1})}>-</button>
                        {count}
                    <button  type="button"  onClick={()=>cart.inc({id:id, count:1}, fixCount)}>+</button>
                </td>
                <td style={{width:"55%"}}>{itmePrice}</td>
                <td>{(!gift) ? <a href="#!"  onClick={()=>cart.remove(id)}>Remove</a> : null}</td>
            </tr>
        );
    });
}

const mapStoreToProps = (state)=> ({state});
export default connect(mapStoreToProps)(withCart(SimpleItems));