//Promise
// function getCategoryList() {
//     fetch('/get-category-list', {
//         method: 'POST'
//     }).then(function(response) {
//         console.log(response);
//         return response.text();
//     }).then(function(body) {
//         console.log(JSON.parse(body));       
//     }); 
// }





async function getCategoryList(){
    let newList = await request('/get-category-list', 'POST');
    showCategoryList(newList);   
};

getCategoryList();

function showCategoryList(data){
    let out = '<ul class="category-list"<li><a href="/">Main</a></li>';
    for(let i = 0; i < data.length; i++) {
        out += `<li><a href="/categories?id=${data[i]['id']}">${data[i]['category']}</a></li>`
    }
    out += '</ul>';
    document.querySelector('#category-list').innerHTML = out;
}


async function request(url, method = 'GET', data = null) {
    try {
        
        const headers = {};
        let body;
        
        if(data) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

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


document.querySelector('.close-nav').onclick = closeNav;
document.querySelector('.show-nav').onclick = showNav;

function closeNav(){
    document.querySelector('.site-nav').style.left = '-300px';
}

function showNav(){
    document.querySelector('.site-nav').style.left = '0';
}
