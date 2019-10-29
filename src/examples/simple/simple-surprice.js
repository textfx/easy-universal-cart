import React from 'react';
import {connect} from 'react-redux';
import {withCart} from '../../cart/cart-driver'

function Surprice({cart, surprise}){
  const gift = cart.is("gift");

  return (<div id="surprise" className="surprise"  style={{paddingBottom: "20px"}}>
      <h1>GIFTS</h1>
      <div> (total>3000 or count>2)</div>
      <label>
          <img src="./img/gifts/1.jpg" alt="" className="with" /> <div className="info">LAST</div>
          <input type="radio" name="surp" disabled={!gift} onChange={()=>surprise('cap')} /> &nbsp;
      </label>
      <label>
          <img src="./img/gifts/2.jpg" alt=""  className="with"/><div className="info">FIRST</div>
          <input type="radio" name="surp" disabled={!gift}  onChange={()=>surprise('gaiters')}  />
      </label>
      <label>
          <img src="./img/gifts/3.jpg" alt=""  className="with"/><div className="info">LAST</div>
          <input type="radio" name="surp" disabled={!gift} onChange={()=>surprise('gloves')} />
      </label>
  </div>);
}

export default withCart(connect((state)=>({state}))(Surprice));