const socket = io();
let user;
let chatBox = document.querySelector('#chatbox');

Swal.fire({
    title:"Identificate",
    input: "text",
    inputValidator: (value) =>{
        return !value && "Debe identificarse!!!"
    },
    allowOutsideClick: false,
    toast:true
}).then(result =>{
    user = result.value;
    socket.emit('authenticated', user);
});

chatBox.addEventListener('keyup', e =>{
    if(e.key === "Enter"){
        
        if(chatBox.value.trim().length > 0 ){
            socket.emit('message', {user: user, message: chatBox.value.trim()});
            chatBox.value = "";
        }
    }
});

socket.on('messageLogs', data =>{
    if(!user) return;
    let log = document.querySelector('#messageLogs');
    let messages = "";

    data.forEach(message => {
        messages += `${message.user} dice: ${message.message} <br/>`
    });
    
    log.innerHTML = messages;
});

socket.on('newUserConnected', data =>{
    if(!user) return;
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
        title: `${data} se unió`,
        icon: "success"
    });
})