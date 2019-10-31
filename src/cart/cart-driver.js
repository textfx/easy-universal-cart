import React from 'react';

//Источник истины localStore не редюсер!!! Потому возможно между вкладками данные из корзины передавать.
export function CartDriver(store, nameLocalState = "cart", nameFormVariable = "cart_form") {
    let result = [], submitClear = false, cartApp = nameLocalState;

    //для удобства работы с localStorage
    let _getLocal = (name, def=[]) => {
        let result =  JSON.parse(localStorage.getItem(name));
        return result ? result : def;
    };
    let _setLocal = (name, val) => localStorage.setItem(name, JSON.stringify(val));

    if (nameLocalState) {
        store.dispatch({type: 'CART_SET_STATE', state:_getLocal(nameLocalState)});
        store.subscribe(()=> _setLocal(nameLocalState, store.getState()));   // меняем localStore когда корзина обновляется
    }

    const dispatch = (action, takeLocalStore = true)=>store.dispatch((dispatch)=>{
        submitClear = false;
        if (takeLocalStore)
            dispatch({type: 'CART_SET_STATE', state:_getLocal(nameLocalState)});
        dispatch(action);
    });

    return {
        get(id) {
            return (store.getState() || []).find((item)=> item.id === id);
        },

        is (id) {
            return !!(this.get(id));
        },

        string(num, quotes = "'") {
            return  Number.isInteger(num) ? num : quotes+num+quotes;
        },

        add(item) {
            dispatch({type: 'CART_ADD', item});
        },

        remove(id) {
                dispatch({type: 'CART_REMOVE', item: {id}});
        },

        inc(item) {
            dispatch({type: "CART_INC", item});
        },

        dec(item){
           dispatch({type: "CART_DEC", item});
        },

        set(item) {
           dispatch({type: "CART_SET", item});
        },
        //всегда возращает последнее состояние.
        //Можно задать товары из cookies или очистить данные перед отправкой, что бы корзина была пустой когда назад вернёшься
        setState(array) {
           dispatch({type: 'CART_SET_STATE', state:array}, false);
        },

        //стоит вызывать при открытии корзины, что бы всегда были актуальные данные
        updateState() {
            submitClear = false;
            store.dispatch({type: 'CART_SET_STATE', state:_getLocal(nameLocalState)});
        },
        //Позволяет очистить стейт
        clear() {
            store.dispatch((dispatch)=>dispatch({type: 'CART_SET_STATE', state:[]}));
        },



        //FORMS
        getForm(name) {
            let cart = _getLocal(nameFormVariable);
            return (cart) ? cart[name]: "";
        },
        //Добавить из рендер функции какое то значение, free_delivery:true например всё буедт добавленно на сервер
        setForm(name, value){
            _setLocal(nameFormVariable, {..._getLocal(nameFormVariable), [name]:value});
            return value;
        },
        removeForm(name){
            let cart =_getLocal(nameFormVariable);
            console.log(delete cart[name]);
            //delete cart[name];
            _setLocal(nameFormVariable, cart);
        },
        clearForm(){
            _setLocal(nameFormVariable, []);
        },
        //два метода помогающих решить проблему с кешированием результатов
        submitClearIs() {
            return submitClear;
        },
        submitClear() {
           submitClear = true;
           this.clear();
        },
        getInput(custom) {
            if (submitClear)
                return result;

            result = [];
            _getLocal(nameLocalState).forEach((item)=>{
                result.push(<input key={item.id} type="hidden" name="cart[]" value={JSON.stringify(item)} />);
            });

            let obj  = {..._getLocal(nameFormVariable), ...custom};
            for (let key in obj) {
                if (obj.hasOwnProperty(key))
                    result.push(<input key={key} type="hidden" name={key} value={obj[key]} />);
            }

            return result;
        },
        getAjax(custom) {
            return {cart:_getLocal(nameLocalState), ..._getLocal(nameFormVariable), ...custom};
        },


        //Если в корзине нечего нет, нечего не сработает
        //cart_over данные которые генерируются в рендер функции, можно записать в локак стор, для кадого товара, и они гарантированно будут отправлены на сервер
        //сюда автоматически пишется скидка по ячейке товара {"price_discount": 760} //перетирает только указанное свойство, или добавляет новое
        //на самом деле задаёт только перечисленные свойства обьекта, а не объект в целом. set для простоты запоминания. setForm setLocal однотипно, addLocal путал бы всё
        setLocal(id, obj) {
            if (!obj || id === undefined) return;
            _setLocal(cartApp, (_getLocal(cartApp) || []).map((item)=> item.id === id ? {...item, ...obj} : item));
        },
        getLocal(id, name) {
            let index, cart = _getLocal(cartApp) || [];
            return ((index = cart.findIndex((item) => item.id === id))> -1) ? cart[index][name] : undefined;
        },
        removeLocal(id, name){
           return _setLocal(cartApp, (_getLocal(cartApp) || [])
                        .map((item)=> {
                            if (item.id === id)
                                delete item[name];
                            return item;
                        }));
        },
        getLocalState() {
            return _getLocal(nameLocalState);
        },
        //Позволяет не явно очистить коризну, после обновления страницы, она будет пуста
        //Если выполнить во время sumit формы перед отправкой, мы очитим хранилище. Надёжнее чистить корзину сразу this.clear()
        clearLocalState() {
            _setLocal(nameLocalState, []);
        },



        //Game of Price
        //к примеру price и оно посчитает суму всех полей прайс
        //item == {price:100, discount:10, id:12, name:abc}
        //key == price
        //discount значение поумолчанию, на случай если нужно указать глобальную скудику, discount в item указанный как совойство, перекрывает глобальный в атрибутах
        sum(key, discount, callback) {
            let sum = 0;
            (store.getState() || []).forEach((item)=>{
                if (item[key]) {
                    let s =  (discount !== undefined)
                        ? this.discount(item[key], item["count"], (item["discount"] ? item["discount"] : discount))
                        : item[key]; //this.discountObj(item, key, discount);
                    //Позволяет например передать roundMagic функцию сюда, и сделать число болие красивым
                    sum += callback ? callback(s) : s;
                }
            });
            return sum;
        },
        sumPrice(key, discount, callback){
            return this.setForm("cart_sum", this.sum(key, discount !== undefined ? discount : 0, callback));
        },
        //полиморф, позволяет price:{10:300,20:250,30:200} или discount:{10:10, 20:50} преобразить в однозначный int. Например количество товара 11, значит discount:10 а price:300
        //на случай когда я захочу узнать свою скидку в зависемости от количества, в рендер функции, допустим вывести крупными буквами, возле ячейки. -10%
        current(count, discount) {
            if (typeof discount === "number")
                return discount;
            else if (discount !== null && typeof discount === "object") {
                let k=0;
                Object.keys(discount).forEach((key)=>{
                    if (k < parseInt(key) && parseInt(key)<=count )  // ищем максимальную скидку, дя указанного количества
                        k = key;
                });
                return discount[k] === undefined ? 0 : discount[k];
            } else
                return 0;
        },

        //экономия, разница цены без скидки и со скидкой.
        save(price, count, discount) {
            return  this.discount(price, count) - this.discount(price, count, discount)
        },

        discount(price, count, discount) {
            const dis = this.current(count, discount);
            const result = count*this.current(count, price);
            return (!dis)
                ?  result
                : Math.floor((result/100)*(100-dis));
        },
        //Делает числа красивыми
        //Не используйте эту функцию, если наценка незначительная.
        roundMagic(x, precision = 10 ) {
            let d =  Math.ceil(x/precision)*precision;
            return d !== x ? d-precision : d; //Не когда не спросит с клиента сумму больше, чем до округления
        },


        //actions add or remove inside render function
        toggle(display, id, yes, no){
            if (display) {
                if (!this.is(id))
                    yes();
            } else if(this.is(id)) {
               no ? no(id) : this.remove(id);
            }
        }
    };
}

export let cartInstance;

export function setCart(YourClass) {
    cartInstance =  YourClass;
    return cartInstance;
}
export function Cart(store, YourClass) {
    cartInstance =  (YourClass) ? new YourClass(store) : new CartDriver(store);
    return cartInstance;
}

export function useCart() {
    return cartInstance;
}
export function withCart(Component) {
   return (props)=> <Component cart={cartInstance} {...props} />;
}




