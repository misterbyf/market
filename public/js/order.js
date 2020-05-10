document.querySelector('#shop-order').onsubmit = (event) => {
  event.preventDefault();

  let userName = document.querySelector('#username').value.trim();
  let phone = document.querySelector('#phone').value.trim();
  let email = document.querySelector('#email').value.trim();
  let adress = document.querySelector('#adress').value.trim();

  if(!document.querySelector('#rule').checked){
      //Нету подтверждения
  }

  if(userName == '' || phone == '' || email == '' || adress == ''){
      //Пусто
  }
}