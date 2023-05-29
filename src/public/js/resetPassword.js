const form = document.getElementById("resetPassForm");

form.addEventListener('submit', e=>{
    e.preventDefault();

    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());

    
    fetch('/api/sessions/restartPassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    })
    .then(result => {
        if(result.status == 200){
            console.log('contraseña restaurada');
            
            window.location.replace('/login')
        }
    })
    .catch(error => console.error('Error:', error));
    
})