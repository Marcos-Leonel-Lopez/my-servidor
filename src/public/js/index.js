 

// const form = document.querySelector('#myForm')
// form.addEventListener('submit', e => {
//     e.preventDefault();
//     const formData = new FormData(form);
//     const data = {};
//     for (let [key, value] of formData.entries()) {
//         data[key] = value;
//     }
//     socket.emit('newProduct', 
//                 data,
//                 function(){ 
//                     console.log('se disparo');
//                 });
//                 form.reset();
// })


// const formDelete = document.querySelector('#formDelete');
// const deleteButton = document.querySelector('#delete-button');
// deleteButton.addEventListener('click', () => {
//     const id = document.querySelector('#number-input').value;
//     socket.emit('delete', id)
//     formDelete.reset();
// });

