import React, {useState,useRef, useCallback} from 'react';
import {useSelector, } from 'react-redux';
import {useCart} from '../../../cart/cart-driver'
import CartOrder from './cart-order';
import './cart-render.css';
import Modal from './../modal/modal'
import {surprise} from "../../simple/simple";
import CartTable from './cart-table';

const CartRender = ({ open, setOpen})=> {

    const cart = useCart(),
          state = useSelector((state)=>state),
          sum = cart.sumPrice("price"),
          modalRef = useRef(null),
        [error, setError] = useState(false),
        [tabel, setTable] = useState(true);

    // Give or Remove Gift
    cart.toggle((sum>3000 || state.length>(!cart.is("gift") ? 2 : 3)), "gift", ()=>surprise('gloves'));

    const onNext = useCallback(()=>{
        if (!state.every(({id, currentSize})=> id==="gift" || (currentSize!=="-" && currentSize!==undefined))) {
            modalRef.current.scrollTop=0;
            setError(true);
        } else {
            setError(false);
            setTable(false);
        }
    }, [state]);

    const openCart = useCallback(()=>{
        cart.updateState();
        setOpen(true)
    }, [cart,setOpen]);

    const closeCart = useCallback(()=>{
        setTable(true);
        setOpen(false);
    }, [setTable,setOpen]);


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
};
CartRender.whyDidYouRender = true;

export default CartRender;

//const mapStoreToProps = (state)=> state;
//export default withCart(connect(mapStoreToProps)(CartRender));