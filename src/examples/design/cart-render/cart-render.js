import React, {useState,useRef} from 'react';
import {connect} from 'react-redux';
import {withCart} from '../../../cart/cart-driver'
import CartOrder from './cart-order';
import './cart-render.css';
import Modal from './../modal/modal'
import {surprise} from "../../simple/simple";
import CartTable from './cart-table';




function CartRender({state, cart, open, setOpen}) {
    const sum = cart.sumPrice("price"),
        [error, setError] = useState(false),
        [tabel, setTable] = useState(true),
        modalRef = useRef(null);

    // Give or Remove Gift
    cart.toggle((sum>3000||state.length>(!cart.is("gift") ? 2 : 3)), "gift", ()=>surprise('gloves'));

    const isError = ()=> !state.every(({id,currentSize})=> id==="gift" || (currentSize!=="-" && currentSize!==undefined));

    const onNext = ()=>{
        if (isError()) {
            modalRef.current.scrollTop=0;
            setError(true);
        } else
            setTable(false);
    };


    const openCart  = ()=>{
        cart.updateState();
        setOpen(true)
    };

    const closeCart = ()=>{
        setTable(true);
        setOpen(false)
    };


    return(
         <>
             {/*Cart*/}
             <Modal isOpen={open} close={closeCart} onRef={modalRef}>
                 {tabel
                     ? <CartTable state={state} error={error} sum={sum} onNext={onNext}/>
                     : null}

                 {/*Если перерисовывать каждый раз, то потрётся Имя Фамилия при закрытии окна, потому регулируем видимость.*/}
                 <CartOrder onBack={setTable} display={!tabel}/>
             </Modal>

             {/*Icon Cart*/}
             {state.length
                 ? (<a href="#!" className="icon-cart" onClick={openCart}>
                      <span className="counter">{state.length}</span>
                      <i className="fas fa-cart-arrow-down font-26"></i>
                   </a>)
                 : null}
         </>
    );
}

const mapStoreToProps = (state)=> ({state});

export default withCart(connect(mapStoreToProps)(CartRender));