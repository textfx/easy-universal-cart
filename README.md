Easy Universal Cart allows to create the unique cart design for the variety of landing pages in a fast way.\
But you can use it to create shops like amazon :) \

All you need to do is to create the design, everything else will be done for you by Easy Universal Cart.

![Image alt](https://github.com/textfx/easy-universal-cart/blob/master/public/logo.gif)

## Возможности Functions
- Checkout for the order on a separate page 
- Cart synchronization between different browser tabs
- Clears the cart before POST requests on the server
- You can send any variable to the cart
- You can control the cart from any component

# Core of Cart (file cart-reducer.js)
```javascript 
const state = [
                {count, fixCount, position, ...someСustomProperties},
                {count, fixCount, position, ...someСustomProperties},
              ];
```

#### Сonstants

| Property      | Default              | Purpose                    | Set                     |
| ------------- | ----------------------- | ----------------------- | ----------------------- |
| id        | required | ID of goods  |```{id:1} or {id:"string_id"}``` |
| count    | 1  |Quantity of goods | ```{id:1} === {id:1, count:1}```<br>  ```{id:1, count:5} //default value is 5```<br>```{id:1, count:8} //default value is 8```|
| fixCount | false  | It freezes count property <br>| ```{id:1, count:3, fixCount:true}``` // all the time count === 3|
| position | undefined | Fix item's position in the cart |```{id:1, position:"first"} // always at the first position```<br>  ```{id:1, position:"last"}  // always at the last position```<br> |

- You must always set the property of ID 
- You can set any users property like:
```javascript
    {id:2, price:200, array:[1,2,3], func:()=>console.log("my function")}
````

#### Actions of Reducer
| Action      |  Purpose                    | Set                     |
| ------------- | ----------------------- | ----------------------- |
| CART_ADD    | Adds one item to the cart  | ``` { type: 'CART_ADD', item: {id:1, name: "potato",  price:1234}}``` |
| CART_REMOVE   | Removes one item from the cart | ``` { type: 'CART_REMOVE', item: {id:1}}``` |
| CART_INC |  Increases the property at a specific number.| if count===2 and  someItem===4 when you dispatch:<br><br> ```{ type: 'CART_INC', item: {id:1, count:3, someItem:4}}``` <br> <br> Result: count ===5 someItem ===8|
| CART_DEC |  Decreases the property at a specific number.| if count===2 and  someItem===4 when you dispatch:<br><br> ```{ type: 'CART_DEC', item: {id:1, count:3, someItem:4}}``` <br> <br> Result: count ===-1 someItem ===0 and item will be removed automatically because count <= 0 |
|CART_SET| Replaces properties of the item | ``` { type: 'CART_SET', item: {id:1, name: "new Name",  price:"new Price"}}``` |
|CART_SET_STATE| Replaces ```state``` with a new array [{},{},{}] | ``` { type: 'CART_SET_STATE', state: [{id:1},{id:2},{id:3}]}``` |

##### How to use?
```javascript
import { createStore } from 'redux';
import cartReducer from '../cart/cart-reducer';

const store = createStore(cartReducer);

 store.dispatch({ 
    type: 'CART_ADD', 
    item: {id:1, name: "potato",  price:1234, valuta:"UAH"}
 });

 store.dispatch({ 
    type: 'CART_INC', 
    item: {id:1, count: 5}
 });

 store.dispatch({ 
    type: 'CART_REMOVE', 
    item: {id:1}
 });
```

Is it all? Yes and No. You can use this reducer, but I recommend that you create your own 'Cart Driver' or use mine. 

# Cart Driver (file cart-driver.js)
LocalStorage is a source of truth. It means that ```state``` takes the variable of ```localStorage```

#### Сonstants

| Property      | Default              | Purpose                    | Set                     |
| ------------- | ----------------------- | ----------------------- | ----------------------- |
| price       | undefined | Price of goods<br/>You can use any name for prices like:<br/>```{dollars:10}``` or ```{myprice:{1:10, 10:8}}```  |```{id1, price:800}```<br>```{id1, price:{1:800, 5:790, 10:690}```<br><br>**Note**: you must set price at least for 1 item, I mean ```price:{1:800}``` or ```price:800``` |
| discount    | 0  | discount for ```price``` |```{id:1, discount:10} // price-10%```<br/><br/>```{id:2, discount:{10:15, 50:25} ```<br/>```if count>=10 then price-10%```<br/>```if count>=50 then price-25%```<br/>|

## Methods
### Actions
Creates action like CART_ADD or CART_REMOVE and dispatches to the store.

| Method      | Purpose                    | How to use?                     |
| ------------- | ----------------------- | ----------------------- |
| is(id)      | Checks if there is ID in the cart |```cart.is(1)``` |
| get(id)       |Returns item with ID |```cart.get(1)``` <br>```return {id:1, price:80, discount:10, count:2}``` |
| add(id)       |Adds one item to the cart <br>  |```cart.add({id:1, myprice:80, count:15})``` |
| remove(id)   | Removes one item from the cart|```cart.remove(0) // remove item with id === 0``` |
| inc(item)   | Increases the property at a specific number. |```cart.inc({id:id, count:1})```<br>```cart.inc({id:id, myProperty:5}) //it's possible to increase the value of any property``` |
| dec(item)  | Decreases the property at a specific number. |```cart.dec({id:id, count:1})```<br>```cart.dec({id:id, myProperty:5}) //it's possible to decrease the value of any property```  |
| set(item)  | Replaces properties of the item  | ```cart.set({id:1, name: "new Name",  price:"new Price"})``` |
| setState(array)| Replaces ```state``` with a new array [{},{},{}] |```cart.setState([{id:1},{id:2},{id:3}])``` |
| updateState()       |Allows to synchronize the contents of the cart between the browser tabs. Analogue: <br />```{ type: 'CART_SET_STATE', state: LocalStorage}``` |```cart.updateState() // it's recommended to call before the cart opening ``` |
| clear()       | Makes the cart empty. Analogue:<br>```{type: 'CART_SET_STATE', state:[]} ```|```cart.clear()``` |

### Forms
| Method      | Purpose                    | How to use?                     |
| ------------------------- | ----------------------- | ----------------------- |
| getInput(custom) | Returns the array of inputs like:<br /> ```<input type="text" name="cart[]" vale="{id:1, price:800...}">``` <br /> It is needed to send the cart contents to the server with the help of the standard tag ```<form>``` in html.  |```<form>{cart.getInput()}</form>```<br/>```<form>{cart.getInput({"onlinePay":true, "myProperty2":"text"})}</form>```<br> **Note:** To call after the cart rendering, or using the last method during the rendering for the data to be relevant.|
| getAjax(custom)       | Returns all the data like ```getInput```, but in the form of object: <br> ```{cart:"cart contents", ..."All the variable set with the help of setForm", ...custom}``` |```cart.getAjax();```<br>It's recommended to call ```cart.clear()``` after sending data of ```getAjax()``` |
| setForm(name, value)  | Sets the variable which also should be sent to the server with the cart contents. |```cart.setForm("onlinePay", true)``` |
| getForm(name)     | Gets the current variable value |```cart.getForm("onlinePay") === true``` |
| removeForm(name)    | Removes the variable |```cart.removeForm("onlinePay")``` |
| clearForm()    | Removes all set variables |```cart.clearForm()``` |
| submitClear()       | Calls ```cart.clear()``` and sets the value of ```submitClear``` equals ```true```<br/>It allows to clear the cart, but save its copy for sending to the server<br> In this case ```cart.getInput()``` returns the latest copy. |```cart.submitClear() //It's recommended to use in the event onSubmit to clear the cart before sending``` |
| submitClearIs()       | Returns the current value of ```submitClear``` (After changing in the cart becomes ```false```) |```cart.submitClearIs()``` |

### Local
Methods that allow to add properties of the item in the cart without re-rendering.
Changes the content of the cart in the LocalStorage.
It is useful when you want to add some property to the item in the cart like ```{priceWithDiscount: 690}```, but  don't want to rerender contents of the cart.

| Method      | Purpose                    | How to use?                     |
| ------------------------- | ----------------------- | ----------------------- |
| setLocal(id, item)       | Adds property to the item in the cart with specified ID |Let's just say that the cart has the item with a value:<br/>```{id:1, price:200}```<br>You call: <br> ```cart.setLocal(1, {priceWithDiscount:180})``` <br/> ```Result: {id:1, price:200, priceWithDiscount:180}``` |
| getLocal(id, name)       | Returns the property of the item with the specified name  |```getLocal(1, "priceWithDiscount") === 180```|
| removeLocal(id, name)    | Removes the specified property of the item<br>**Note:** Don't remove properties which were not added  with the help of ```setLocal```! |```getLocal(1, "priceWithDiscount")```<br />```Result: {id:1, price:200}```|
| getLocalState()    | Returns the latest content of the cart |```cart.getLocalState()```|
| clearLocalState()    | Clears the source of truth(LocalStorage). |```cart.clearLocalState() ```|


### Game of Price
Methods which calculate price, total, discount.

| Method      | Purpose                    | How to use?                     |
| ------------------------- | ----------------------- | ----------------------- |
| sum(key, discount, callback)| ```key```: property name with the type number like ```price```<br> ```discount```: global discount, which is set for all the items where ```{discount:undefined}``` may be ```null```, ```number```, or ```object``` like ```{1:10, 20:15}```<br/> ```callback```: Is called for each value of ```item[key]``` |```cart.sum("price", 0) //Sum of all prices with the discount``` <br/> ```cart.sum("price") //Sum of all prices without the discount``` |
| sumPrice(key, discount, callback)| ```sumPrice``` works like ```sum``` but always sums all prices with the discount, <br>and always saves the result to property ```cart_sum``` to send to the server  <br> Analogue: ```setForm("cart_sum", this.sum(....))``` |```cart.sumPrice("price") === cart.sum("price", 0)```|
| current(count, discount) |Converts ```price:{1:80, 10:70}``` or ```discount:{10:10, 15:20}``` to the number, depends on ```count``` |```cart.current(21, {10:10, 15:20}) === 20%(discount) ```<br> ```cart.current(10, {1:80, 10:70}) === 70$(price)```|
| save(price, count, discount) | Shows the difference between the price without the discount and with the discount.  |```cart.save({1:80, 10:70}, 10 ,{10:10, 15:20})```<br>```Result: price-(price-discount) = 70```|
| discount(price, count, discount) | Returns a current price of goods with the discount |```cart.discount(80, 11, {10:10, 15:20})```<br>```Result: 72```|
| roundMagic(x, precision = 10)   | Rounding a number|```cart.roundMagic(853.5)```<br> ```Result: 850```|


### Others
| Method      | Purpose                    | How to use?                     |
| ------------------------- | ----------------------- | ----------------------- |
| toggle(display, id, yes, no) | Helps to remove or add a gift to the cart if ```display``` is ```true``` during the rendering  |```cart.toggle(sum>3000, "gift", ()=>cart.add({id:"gift"}), ()=>cart.remove({id:"gift"}))``` |
| string(num, quotes = "'")| Wraps specified number in quotes, just in case. |```string(10)```<br> ```Result: '10'; ``` |


## Getting Started with Cart

Warning! CartDriver depends on ```thunk``` middleware. Let's create 2 files;

### index.js

```javascript

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';  
import cartReducer from './cart/cart-reducer';
import {Cart, setCart} from './cart/cart-driver';
import MyFirstRender from './my-first-render'


const store = createStore(cartReducer, JSON.parse(localStorage.getItem('cart')), applyMiddleware(thunk));
const cart = Cart(store);  // It's a short way  

// It's a long way 
    //constructor === CartDriver(store, nameLocalState = "cart", nameFormVariable = "cart_form")
    //setCart(new CartDriver(store, "my_cart", "my_cart_form"));
    
ReactDOM.render((
        <Provider store={store}>
          <button onClick={()=>cart.add({id:1, name:"myFirstItem", price:20})} style={{margin: "10px"}} >Add firstItem</button>
          <button onClick={()=>cart.add({id:2, name:"mySecondItem", price:10})}>Add secondItem</button><br/>
          
          <MyFirstRender /> 
        </Provider>), document.getElementById('root'));
  
```

### my-first-render.js

```withCart``` is a little HOC function. You can use ```useCart``` if you work with hooks.

```javascript
import React from 'react';
import {connect} from 'react-redux';
import {withCart} from './cart/cart-driver';

export default function MyFirstRender({state, cart}) {
    const sum = cart.sumPrice("price");
    const items = state.map((item) => {
                   const {id, name, price, count, discount} = item;  
                     
                   const dec = <button  type="button" onClick={()=>cart.dec({id, count:1})}>-</button>;
                   const inc = <button  type="button" onClick={()=>cart.inc({id, count:1})}>+</button>;
                   const remove = <a href="#!"  onClick={()=>cart.remove(id)}>Remove</a> 
                   const currentPrice = cart.discount(price, count, discount);

                   return (                 
                       <div key={id}>
                          {id} {name} {dec} {count} {inc} {currentPrice} {remove}
                       </div>
                   );
               });

    return <>
       Total: {sum}
       {items}
    </>
}

export default withCart(connect((state)=>({state}))(MyFirstRender));
```

### Result
![Image alt](https://github.com/textfx/easy-universal-cart/blob/master/public/img/readme.png)

### Summary
I hope you like the library and you're going to create a lot of cart designs with the help of Easy Universal Cart