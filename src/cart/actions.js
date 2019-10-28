//для удобства работы с localStorage
let _getLocal = (name, def) => {
    let result =  JSON.parse(localStorage.getItem(name));
    return result ? result : def;
}
let _setLocal = (name, val) => localStorage.setItem(name, JSON.stringify(val));

export function add(item) {
    //submitClear = false;
    return (dispatch) => {
        updateState();
        dispatch({type: 'CART_ADD', item});
    }
};

export function remove(id) {
    return (dispatch) => {
        updateState();
        if (Array.isArray(id))
            id.forEach((id) => {
                dispatch({type: 'CART_REMOVE', item: {id}})
            });
        else
            dispatch({type: 'CART_REMOVE', item: {id}});
    }
};

export function inc(item){
    return (dispatch) => {
        updateState();
        dispatch({type: "CART_INC", item});
    }
};

export function dec(item){
    return (dispatch) => {
        updateState();
        dispatch({type: "CART_DEC", item});
    }
};

export function set(item) {
    return (dispatch) => {
        updateState();
        dispatch({type: "CART_SET", item});
    }
};

//всегда возращает последнее состояние.
//Можно задать товары из cookies или очистить данные перед отправкой, что бы корзина была пустой когда назад вернёшься
export function setMyState(array) {
    return (dispatch) => {
        dispatch({type: 'CART_SET_STATE', state: array});
    }
};

//стоит вызывать при открытии корзины, что бы всегда были актуальные данные
export function updateState(dispatch) {
        dispatch({type: 'CART_SET_STATE', state: _getLocal("cart")});
};

//Позволяет не только очистить стейт, но и получить последнее состояние
export function clear() {
    return (dispatch) => {
        dispatch({type: 'CART_SET_STORE', state: []});
    }
};