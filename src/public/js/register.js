const form = document.getElementById("regForm");

form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    })
    .then(result => {
        if(result.status == 200){
            window.location.replace('/login')
        }
    })
    .catch(error => console.error('Error:', error));
    
})