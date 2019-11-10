/*!
 * Easy-Universal-Cart JavaScript Library v1.1
 * https://github.com/textfx/easy-universal-cart
 *
 * Date: 2019-10-31T23:38Z
 */
//В реальности позиций в корзине не больше 10, даже если 1к будет товаров или 10к, производительность будет высокой.
export default function cartReducer(state = [],  a) {
    if (!a.state && (!a.item || a.item.id === undefined)) {
        return state;
    }

    function crement(item, inc) {
        for (const [key, val] of Object.entries(a.item)) {
            if (key === "id")
                continue;
            item[key] = (item[key] ? item[key] : 0) + (inc ? val : -val);
        }
        return item;
    }
    const incDec = (inc) => {
        return state
                .map((item) => ((item.id === a.item.id) ? crement({...item}, inc) : {...item}))
                .filter((item)=> (item.count > 0)); // Если count <= 0 то удалять item
    };

    const sequence = (state) => {
        const first = state.filter((item)=>item.position === "first");
        const other = state.filter((item)=>item.position === undefined);
        const last = state.filter((item)=>item.position === "last");
        return [...first, ...other, ...last];
    };
    //set and add
    const count = (count, def, visible = true) => visible ? ({count:  count ? ++count : def}) : {};
    const findIndex = (findId) => state.findIndex((item) => item.id === findId);
    const set = (addCount = false) => sequence((~findIndex(a.item.id))
                    ? state.map((item) => (item.id !== a.item.id)
                        ? {...item}
                        : {...item,  ...a.item, ...count(item.count,2, addCount)})  // Если уже есть товар то count++
                    : [...state, {...a.item, ...count(a.item.count,1, addCount)}]);  // иначе добавляем новый

    switch (a.type) {
        case "CART_ADD":
            return set(true); // Разница между CART_ADD and CART_SET только в ++count для CART_ADD
        case "CART_REMOVE":
            return state.filter((item)=>item.id !== a.item.id);
        case "CART_INC":
            return incDec(true);
        case "CART_DEC":
            return incDec(false);
        case "CART_SET":
            return set();
        case  "CART_SET_STATE":
            return sequence((Array.isArray(a.state)) ? a.state : state);
        default:
            return state;
    }
}
// fixCount можно и нужно делать через Driver тут перерисовка, глупая опция была


/* может показатся что можно использоватся state.slice для добавления элементов, но не забываем что в таком случае обновятся только индексы массива, а item внутри останется старый
// потому так делать нельзя!
const count = (count, def, visible = true) => visible ? ({count:  count ? ++count : def}) : {};
const set = (addCount = false) => {
    const index = state.findIndex((item) => item.id === a.item.id);
    return sequence((~index)
        ?   [
            ...state.slice(0, index),
            {...state[index], ...a.item, ...count(state[index].count,2, addCount)},
            ...state.slice(index + 1)
        ]
        : [...state, {...a.item, ...count(a.item.count,1, addCount)}]);
}*/



/* Examples
store.dispatch({ type: 'CART_ADD', item: {id:1, name: "potato",  price:1234, valuta:"UAH"}});
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