import React from 'react';
import {surprise} from "../examples/simple/simple";

export function cartReducer(state = [],  a) {

    if (!a.state && (!a.item || a.item.id === undefined)) {
        return state;
    }

    const findIndex = (findId) => state.findIndex(({id}) => id === findId);
    const incDec = (inc) => {
        return state.map((item) => {
            let it = {...item};
            if (!item.fixCount && it.id === a.item.id)
                for (let [key, val] of Object.entries(a.item)) {
                    if (key === "id") continue;
                    it[key] =  (it[key] ? it[key] : 0) + (inc ? val : -val);
                }
            return it;
        }).filter((itme)=> (itme.count > 0)); // Если count == 0 то удалять item
    };
    const sequence = (state) => {
        let first = state.filter((item)=>item.position === "first");
        let other = state.filter((item)=>item.position === undefined);
        let last = state.filter((item)=>item.position === "last");
        return [...first, ...other, ...last];
    }
    switch (a.type) {
        case "CART_ADD":
            return sequence((findIndex(a.item.id) >= 0)  // find index
                ? state.map((item) => (item.id !== a.item.id) // Если уже есть товар то count+14
                    ? {...item}
                    : {...item, ...a.item, count:  !item.fixCount ? (item.count ? ++item.count : 2) : (a.item.count ? a.item.count : 1)})
                : [...state, {...a.item, count: a.item.count? a.item.count : 1}]);  // иначе добавляем новый
        case "CART_REMOVE":
            return state.filter((item)=>item.id !== a.item.id);
        case "CART_INC":
            return incDec(true);
        case "CART_DEC":
            return incDec(false);
        case "CART_SET":
            // изменить содержимое указанных свойств
            // пример {id: 1, count:  10}
            return sequence(state.map((item) => {
                if (!a.item || a.item.id === undefined)
                    return item;
                return (item.id === a.item.id)
                    ? {...item,  ...a.item}
                    : {...item}
            }));
        case  "CART_SET_STATE": //Позволяет задавать полностью новый стейт.
            return sequence((Array.isArray(a.state)) ? a.state : state);
        default:
            return state;
    }
}

//Источник истины localStore не редюсер!!! Потому возможно между вкладками данные из корзины передавать.
export function CartDriver(store, nameLocalState = "cart") {
    let result = [], submitClear = false, cartApp = nameLocalState;

    //для удобства работы с localStorage
    let _getLocal = (name, def=[]) => {
        let result =  JSON.parse(localStorage.getItem(name));
        return result ? result : def;
    }
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
           return (this.get(id)) ? true : false;
        },

        string(num, quotes = "'") {
            return  Number.isInteger(num) ? num : quotes+num+quotes;
        },

        add(item) {
            dispatch({type: 'CART_ADD', item});
        },

        remove(id) {
           /*if (Array.isArray(id))
                id.forEach((val)=> dispatch({type: 'CART_REMOVE', item: {val}}, val === id[0]));
            else*/
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
        //Позволяет не только очистить стейт, но и получить последнее состояние
        clear() {
            store.dispatch((dispatch)=>dispatch({type: 'CART_SET_STATE', state:[]}));
        },



        //FORMS
        getForm(name) {
            let cart = _getLocal("cart_form");
            return (cart) ? cart[name]: "";
        },
        //Добавить из рендер функции какое то значение, free_delivery:true например всё буедт добавленно на сервер
        setForm(name, value){
            _setLocal("cart_form", {..._getLocal("cart_form"), [name]:value});
            return value;
        },
        removeForm(name){
            let cart =_getLocal("cart_form");
            console.log(delete cart[name]);
            //delete cart[name];
            _setLocal("cart_form", cart);
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

            let obj  = {..._getLocal("cart_form"), ...custom}
            for (let key in obj) {
                if (obj.hasOwnProperty(key))
                    result.push(<input key={key} type="hidden" name={key} value={obj[key]} />);
            }

            return result;
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
        //Если выполнить во время sumit формы, то пере отправкой, мы очитим хранилище, а при возращении назад, данные подтянутся из пустого храналища
        //что позволить избавитя от баги, полной корзины в кеше
        //Срабатывает не во всех версиях браузера, надёжнее чистить корзину сразу this.clear()
        clearLocalState() {
            _setLocal(nameLocalState, []);
        },



        //Game of Price
        //к примеру price и оно посчитает суму всех полей прайс
        //item == {price:100, discount:10, id:12, name:abc}
        //key == price
        //discount значение поумолчанию, на случай если нужно указать глобальную скудику, discount в item указанный как совойство, перекрывает глобальный
        sum(key, discount, callback) {
            let sum = 0;
            (store.getState() || []).forEach((item)=>{
                if (item[key]) {
                    let s =  (discount != undefined)
                        ? this.discount(item[key], item["count"], (item["discount"] ? item["discount"] : discount))
                        : item[key]; //this.discountObj(item, key, discount);
                    //Позволяет например передать roundMagic функцию сюда, и сделать число болие красивым
                    sum += callback ? callback(s) : s;
                }
            });
            return sum;
        },
        sumPrice(key, discount, callback){
            return this.setForm("cart_sum", this.sum(key, discount != undefined ? discount : 0, callback));
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

        //экономия, разница цены без скидки и со скидкой. Функция для удобства
        saving(price, count, discount) {
            return  this.discount(price, count) - this.discount(price, count, discount)
        },

        discount(price, count, discount) {
            const dis = this.current(count, discount);
            const result = count*this.current(count, price)
            return (!dis)
                ?  result
                : Math.floor((result/100)*(100-dis));
        },
        //Делает числа красивыми
        //Не используйте эту функцию, если для важна каждая копейка, и наценка не большая.
        roundMagic(x, precision = 10 ) {
            let d =  Math.ceil(x/precision)*precision;
            return d !== x ? d-precision : d; //Не когда не спросит с клиента сумму больше, чем до округления
        },


        //actions add or remove inside render function
        toggle(display, name, yes, no){
            if (display) {
                if (!cart.is(name))
                    yes();
            } else if(cart.is(name)) {
               no ? no(name) : cart.remove(name);
            }
        }
    };
}

export let cart;
export function setCart(YourClass) {
    cart =  YourClass;
    return cart;
}
export function Cart(store, YourClass) {
    cart =  (YourClass) ? new YourClass(store) : new CartDriver(store);
    return cart;
}

export function useCart() {
    return cart;
}
export function withCart(Component) {
   return (props)=> <Component cart={cart} {...props} />;
}


/*function deleteCat(id){
    store.dispatch({
        type: 'CART_REMOVE',
        item: {id}
    });
}*/




/*store.dispatch({
    type: 'CART_ADD',
    item: {name: "tovar1", id:1, price:1234, valuta:"grn"}
});
store.dispatch({
    type: 'CART_ADD',
    item: {name: "tovar2", id:2, price:1234, valuta:"grn"}
});
store.dispatch({
    type: 'CART_ADD',
    item: {name: "tovar12", id:12, price:1234, valuta:"grn"}
});
store.dispatch({
    type: 'CART_SET',
    item: {name: "igor", id:1, price:1234, count:15, valuta:"grn"}
});
store.dispatch({
    type: 'CART_ADD',
    item: {name: "tovarINC", id:13, price:1234, valuta:"grn"}
});
store.dispatch({
    type: 'CART_REMOVE',
    item: {id:2}
});
store.dispatch({
    type: 'CART_INC',
    item: {id:13, count:5}
});
store.dispatch({
    type: 'CART_DEC',
    item: {id:13, count:2}
});*/

