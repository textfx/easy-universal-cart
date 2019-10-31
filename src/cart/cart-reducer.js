/*!
 * Easy-Universal-Cart JavaScript Library v0.9
 * https://github.com/textfx/easy-universal-cart
 *
 * Date: 2019-10-29T21:04Z
 */
export default function cartReducer(state = [],  a) {
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
        }).filter((itme)=> (itme.count > 0)); // Если count <= 0 то удалять item
    };
    const sequence = (state) => {
        let first = state.filter((item)=>item.position === "first");
        let other = state.filter((item)=>item.position === undefined);
        let last = state.filter((item)=>item.position === "last");
        return [...first, ...other, ...last];
    };
    switch (a.type) {
        case "CART_ADD":
            return sequence((findIndex(a.item.id) >= 0)  // find index
                ? state.map((item) => (item.id !== a.item.id) // Если уже есть товар то count++
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
        case  "CART_SET_STATE":
            return sequence((Array.isArray(a.state)) ? a.state : state);
        default:
            return state;
    }
}


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