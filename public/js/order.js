document.querySelector('#shop-order').onsubmit = async(event) => {
  event.preventDefault();

  let userName = document.querySelector('#username').value.trim();
  let phone = document.querySelector('#phone').value.trim();
  let email = document.querySelector('#email').value.trim();
  let adress = document.querySelector('#adress').value.trim();

  if(!document.querySelector('#rule').checked){
      swal({
        icon: 'warning',
        title: 'Warning',
        text: 'Read and accept the rule',
        button: {
          text: 'OK'
        }
      })
      return false;
  }

  if(userName == '' || phone == '' || email == '' || adress == ''){
      swal({
        icon: 'warning',
        title: 'Warning',
        text: 'Fill all fields',
        button: {
          text: 'OK'
        }
      })
      return false;
  }


  let response = await request('/finish-order', 'POST', {
    'username': userName,
    'email': email,
    'adress': adress,
    'phone': phone,
    'key': JSON.parse(localStorage.getItem('cart')),
  });

  if(response == 1) {
    swal({
      icon: 'success',
      title: 'Message',
      text: 'Message has been send',
      button: {
        text: 'OK'
      }
    });
    return false;
  } else {
    swal({
      icon: 'warning',
      title: 'Error',
      text: 'Problem with mail',
      button: {
        text: 'OK'
      }
    });
    return false;
  }  
}


async function request(url, method = 'GET', data = null) {
  try {
    const headers = {};
    let body;

    if (data) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }
    updateToLocaleStorage();
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    return await response.json();
  } catch (e) {
    console.warn('ERROR', e.message);
  }
}