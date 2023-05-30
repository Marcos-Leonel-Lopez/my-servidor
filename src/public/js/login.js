const form = document.getElementById("loginForm");

form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    })
        .then(result => {
            if(result.status == 200){
                window.location.replace('/profile')
            }
        })
        .catch(error => console.error('Error:', error));
})