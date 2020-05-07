let cart = {};
document.querySelectorAll('.add-to-cart').forEach((element) => {
    element.onclick = addToCart;
});

loadPageToSorage()

async function loadPageToSorage(){
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
        showCart(await request('/get-models-info', 'POST', {
            key: Object.keys(cart)
        }));
    }
}

async function addToCart(){
    let modelsId = this.dataset.models_id;
    if(cart[modelsId]) {
        cart[modelsId]++;
    } else {      
        cart[modelsId] = 1;
    }
    showCart(await request('/get-models-info', 'POST', {
        key: Object.keys(cart)
    }));
    //ajaxGetModelsInfo();
}


function showCart(data){
    let out = '<table class="table table-sm table-striped table-cart"><tbody>';
    let total = 0;
    for(let key in cart){
        out += `<tr><td colspan="4"><a href="/models?id=${key}">${data[key]['name']}</a></td></tr>`;
        out += `<tr><td><i class="far fa-minus-square cart-minus" data-models_id="${key}"></i></td>`;
        out += `<td>${cart[key]}</td>`;
        out += `<td><i class="far fa-plus-square cart-plus" data-models_id="${key}"></i></td>`;
        out += `<td>${data[key]['cost'] * cart[key]} uah </td>`
        out += `</tr>`;
        total += cart[key] * data[key]['cost'];      
        
    }
    out += `<tr><td colspan="3">Total:</td><td>${total}</td></tr>`;
    out += '</tbody></table>';

    document.querySelector('#cart-nav').innerHTML = out;

    document.querySelectorAll('.cart-plus').forEach((element) => {
        element.onclick = cartPlus;
    });
    document.querySelectorAll('.cart-minus').forEach((element) => {
        element.onclick = cartMinus;
    });    
}


async function cartPlus(){
    let modelsId = this.dataset.models_id;
    cart[modelsId]++;
    showCart(await request('/get-models-info', 'POST', {
        key: Object.keys(cart)
    }));
}


async function cartMinus(){
    let modelsId = this.dataset.models_id;
    if(cart[modelsId] - 1 > 0){
        cart[modelsId]--;
    }else{
        delete(cart[modelsId]);
    }
    showCart(await request('/get-models-info', 'POST', {
        key: Object.keys(cart)
    }));   
}


function updateToLocaleStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}


async function request(url, method = 'GET', data = null) {
    try {       
        const headers = {};
        let body;
        
        if(data) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }
        updateToLocaleStorage();
        const response = await fetch(url, {
            method,
            headers,
            body
        });
        return await response.json();  
    } catch (e) {
        console.warn('ERROR', e.message);
    }
}

// function ajaxGetModelsInfo(){
//     fetch('/get-models-info', {
//         method: 'POST',
//         body: JSON.stringify({ key: Object.keys(cart) }),
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type' : 'application/json'
//         }
//     }).then((response) => {
//         return response.text();
//     }).then((body) => {
//         showCart(JSON.parse(body));
//     })
// }


