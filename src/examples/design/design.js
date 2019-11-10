import React, {useState}  from 'react';
import Product from './product/product';
import CartRender from './cart-render/cart-render';
import "./design.css";
import {Link} from "react-router-dom";


const sizes = ["-","M","S","X"];
const Design =  React.memo( () =>{
        const [open, setOpen] = useState(false);

        return (
            <>
                <Link to="./">Simple</Link><br /><br />

                <div className="center-block">
                    <Product setOpen={setOpen} id={1} img="./img/catalog/1.jpg" beforePrice={1800} afterPrice={990} size={sizes}/>
                    <Product setOpen={setOpen} id={2} img="./img/catalog/2.jpg" beforePrice={1800} afterPrice={850} size={sizes}/>
                    <Product setOpen={setOpen} id={3} img="./img/catalog/3.jpg" beforePrice={1800} afterPrice={790} size={sizes}/>
                    <Product setOpen={setOpen} id={4} img="./img/catalog/4.jpg" beforePrice={1800} afterPrice={1120} size={sizes}/>
                    <Product setOpen={setOpen} id={5} img="./img/catalog/5.jpg" beforePrice={1800} afterPrice={770} size={sizes}/>
                </div>

                <CartRender open={open} setOpen={setOpen}/>
            </>);
});

Design.whyDidYouRender = true;
export default Design

