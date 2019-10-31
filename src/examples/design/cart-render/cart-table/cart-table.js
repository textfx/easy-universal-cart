import React from 'react';
import CartItem from "../cart-item";
import './cart-table.css';

export default function CartTable({state, error, sum, onNext}){

    return (<div className="noselect modal-custom row">
        <h3>{error
            ? <span className="red">ERROR: Choose a size  </span>
            : <span>TOTAL: {sum} UAH.</span>
        }</h3>
        <table className="table font-16">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col" style={{width:"20%"}}>Photo</th>
                <th scope="col">Size</th>
                <th scope="col" style={{width:"20%"}}>Count</th>
                <th scope="col" style={{width:"20%"}}>Price</th>
                <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
                {state.map((props) => <CartItem key={props.id} {...props} />)}
            </tbody>
        </table>

        {state.length ? <div className="center"><a href="#!" className="button-orange" onClick={onNext}  style={{"background": "#d70300", width:"100%"}}>Proceed to checkout</a></div> : null}
    </div>);
}