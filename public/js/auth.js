const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : null;
    //: 'https://rest-server....'


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for(let el of miFormulario.elements) {
        if( el.namespaceURI.length > 0){
            formData[el.name] = el.value;
        }
    }

    console.log(formData)
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': "application/json"}
    }).then((resp) => {
        return resp.json();
    }).then((data) => {
        if(data.msg !== 'Login Ok') {
            return console.error(msg);
        }

        console.log(data);
        localStorage.setItem('token', data.token)
        window.location = 'chat.html'
    }).catch((err) => {
        console.log(err)
    });
})

function handleCredentialResponse(response) {
    // Google token: ID_TOKEN
    // console.log(`id_token, ${response.credential}`);

    const body = { id_token: response.credential}
    fetch(url + 'google', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((resp) => {
         return resp.json();
    }).then((resp) => {
        console.log("TOKEN: " + body.id_token);
         console.log(resp);
         localStorage.setItem('token', body.id_token)
         localStorage.setItem('email', resp.usuario.correo)
         window.location = 'chat.html'
    }).catch(() => {
         console.log(console.warn)
    })
 }

 const button = document.getElementById('google_signout');
 button.onclick = () => {
     console.log(google.accounts.id);

     google.accounts.id.revoke(localStorage.getItem('email'), done => {
         localStorage.clear();
         location.reload();
     })
 }