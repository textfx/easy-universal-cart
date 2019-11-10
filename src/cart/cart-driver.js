import React from 'react';
/*!
 * Easy-Universal-Cart JavaScript Library v1.1
 * https://github.com/textfx/easy-universal-cart
 *
 * Date: 2019-10-31T23:38Z
 */
// Источник истины localStore не редюсер!!! Потому возможно между вкладками данные из корзины передавать.
// Можно разбить на классы Actions, Forms..., но тогда будут видны внутренние методы (_setLocal и другие).
export function CartDriver(store, nameLocalState = "cart", nameFormVariable = "cart_form") {
    let result = [], submitClear = false, cartApp = "cart_add_props";//nameLocalState;

    //для удобства работы с localStorage
    let _getLocal = (name, def=[]) => {
        let result =  JSON.parse(localStorage.getItem(name));
        return result ? result : def;
    };

    let lastUpdated = 0;
    let _setLocal = (name, val, updateTime = false) => {
        if (updateTime) {
            lastUpdated = Date.now();
            localStorage.setItem("cart_last_updated", lastUpdated);
        }
        localStorage.setItem(name, JSON.stringify(val));
    };

    const isLastUpdated = () => lastUpdated !== parseInt(_getLocal("cart_last_updated",1)); // Что бы лишней перерисовки небыло

    if (nameLocalState) {
        store.dispatch({type: 'CART_SET_STATE', state:_getLocal(nameLocalState)});
        store.subscribe(()=> _setLocal(nameLocalState, store.getState(), true));   // меняем localStore когда корзина обновляется

        // Что бы перерисовки не было при первом открытии
        lastUpdated = Date.now();
        localStorage.setItem("cart_last_updated", lastUpdated);
    }

    const dispatch = (action, takeLocalStore = true)=>store.dispatch((dispatch)=>{
        submitClear = false;
        if (takeLocalStore && isLastUpdated())
           dispatch({type: 'CART_SET_STATE', state:_getLocal(nameLocalState)});
        dispatch(action);
    });



    //ACTIONS
    this.get = (id)=> (store.getState() || []).find((item)=> item.id === id);

    this.is = (id) => !!(this.get(id));

    this.add = (item) => dispatch({type: 'CART_ADD', item});

    this.remove = (id) => {
        this.removeLocal(id);
        dispatch({type: 'CART_REMOVE', item: {id}});
    };

    this.inc = (item, fix = false) => (!fix) ?  dispatch({type: "CART_INC", item}) : undefined;

    this.dec = (item, fix = false) => (!fix) ? dispatch({type: "CART_DEC", item}) : undefined;

    this.set = (item) => dispatch({type: "CART_SET", item});

    // Можно задать товары или очистить данные перед отправкой, что бы корзина была пустой когда назад вернёшься
    this.setState = (array) => dispatch({type: 'CART_SET_STATE', state:array}, false);

    // Стоит вызывать при открытии корзины, что бы всегда были актуальные данные
    this.updateState = () => {
            submitClear = false;
            if (isLastUpdated())
                store.dispatch({type: 'CART_SET_STATE', state: _getLocal(nameLocalState)});
    };

    // Позволяет очистить state, аналог this.setState([]) но собьёт submitClear на false
    this.clear = () => {
        this.clearLocalState();
        store.dispatch((dispatch)=>dispatch({type: 'CART_SET_STATE', state:[]}));
    };



    //FORMS
    this.getForm = (name) => {
        const cart = _getLocal(nameFormVariable);
        return (cart) ? cart[name]: "";
    };

    // Добавить переменную для отправки на сервер например free_delivery:true например всё будет отправляться на сервер
    this.setForm = (name, value) => {
        _setLocal(nameFormVariable, {..._getLocal(nameFormVariable), [name]:value});
        return value;
    };

    this.removeForm = (name) => {
        const cart =_getLocal(nameFormVariable);
        _setLocal(nameFormVariable, (delete cart[name] && cart));
    };

    this.clearForm = () => _setLocal(nameFormVariable, []);
    this.submitClearIs = () => submitClear;
    this.submitClear = () => {
        submitClear = true;
        this.clear();
    };

    this.getInput = (custom) => {
            if (submitClear)
                return result;

            result = [];
            _getLocal(nameLocalState).forEach((item)=>{
                result.push(<input key={item.id} type="hidden" name="cart[]" value={JSON.stringify({...item, ...this.getLocal(item.id)})} />);
            });

            let obj  = {..._getLocal(nameFormVariable), ...custom};
            for (let key in obj) {
                if (obj.hasOwnProperty(key))
                    result.push(<input key={key} type="hidden" name={key} value={obj[key]} />);
            }

            return result;
        };
    this.getAjax = (custom) => ({cart:_getLocal(nameLocalState).map(item => ({...item, ...this.getLocal(item.id)})), ..._getLocal(nameFormVariable), ...custom});



    //ADD IN CART OF LOCALSTORAGE
    // Данные которые генерируются в рендер функции, можно записать в локак стор, для кадого товара, и они гарантированно будут отправлены на сервер
    // Если в корзине нечего нет, методы не сработают
    this.setLocal = (id, item) => {
            if (!item || id === undefined) return;
            const obj = (_getLocal(cartApp, {}));
            obj[id] = {...obj[id], ...item};
            _setLocal(cartApp,  obj );
    };
    this.getLocal = (id, name) => {
            const cart = _getLocal(cartApp,{});
            if (id === undefined) return cart;
            if (name === undefined) return cart[id];
            if (cart[id]) return cart[id][name];
    };
    this.removeLocal = (id, name) => {
           const cart = _getLocal(cartApp,{});
           if (id && name === undefined) delete cart[id];
           if (cart[id])
               delete cart[id][name];
           return _setLocal(cartApp, (id === undefined) ? {} : cart);
    };
    this.getLocalState = () => _getLocal(nameLocalState);
    // Позволяет не явно очистить коризну, после обновления страницы, она будет пуста
    // Надёжнее чистить корзину через this.clear()
    this.clearLocalState = () => {
        _setLocal(nameLocalState, []);
        _setLocal(cartApp, {});
    };



    //GAME OF PRICE
    //памятка: item == {price:100, discount:10, id:12, name:abc}
    //key == price посчитает суму всех полей с указаным именем(price)
    //discount значение поумолчанию, на случай если нужно указать глобальную скудику(discount в item) если он неуказан при добавлении
    this.sum = (key, discount, callback) => {
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
    };
    this.sumPrice = (key, discount, callback) => this.setForm("cart_sum", this.sum(key, discount !== undefined ? discount : 0, callback));

    // Полиморф, позволяет price:{10:300,20:250,30:200} или discount:{10:10, 20:50} преобразить в однозначный int. Например количество товара 11, значит discount:10 а price:300
    // Возращает число в зависемости от количества, в рендер функции поможет вывести текущую скидку, например -10%
    this.current = (count, obj) => {
            if (typeof obj === "number")
                return obj;
            else if (obj !== null && typeof obj === "object") {
                let k=0;
                Object.keys(obj).forEach((key)=>{
                    if (k < parseInt(key) && parseInt(key)<=count )  // ищем максимальную скидку, дя указанного количества
                        k = key;
                });
                return obj[k] === undefined ? 0 : obj[k];
            } else
                return 0;
    };

    // Экономия, разница цены без скидки и со скидкой.
    this.save = (price, count, discount) => this.discount(price, count) - this.discount(price, count, discount);

    this.discount = (price, count, discount) => {
            const dis = this.current(count, discount);
            const result = count*this.current(count, price);
            return (!dis)
                ?  result
                : Math.floor((result/100)*(100-dis));
     };

     // Делает числа красивыми. Функция для landing page в магазинах с маленькой наценкой важна не красота а точность, потому используйте с умом.
    this.roundMagic = (x, precision = 10 ) => {
            let d =  Math.ceil(x/precision)*precision;
            return d !== x ? d-precision : d; // Не когда не спросит с клиента сумму больше, чем до округления
    };


    this.getState = store.getState;

    // Actions add or remove inside render function
    this.toggle = (display, id, yes, no) => {
            if (display) {
                if (!this.is(id))
                    yes();
            } else if(this.is(id)) {
               no ? no(id) : this.remove(id);
            }
    };
    this.string = (num, quotes = "'") => Number.isInteger(num) ? num : quotes+num+quotes;
}

//В чём разница setForm and setLocal? setLocal добавляет переменную в ячейку корзизины.

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




