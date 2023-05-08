const socket = io();
const form = document.querySelector('#myForm')
form.addEventListener('submit', e => {
    e.preventDefault();
    if (e.target[9].value === 'Enviar') {
        console.log(e.target[9].value+ 'dentro de enviar');
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        delete data.id;
        socket.emit('newProduct',
            data,
            function () {
                console.log('Producto nuevo');
            });
        form.reset();
        return
    } else {
        
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        const id = document.getElementById("id").value;
        socket.emit('editProduct',
            data,id,
            function () {
                console.log('Producto actualizado');
            });
            document.getElementsByTagName("input")[6].value = "Enviar";
            document.getElementById("title").placeholder = '';
            document.getElementById("description").placeholder = '';
            document.getElementById("price").placeholder = '';
            document.getElementById("thumbnail").placeholder = '';
            document.getElementById("code").placeholder = '';
            document.getElementById("stock").placeholder = '';
            document.getElementById("category").value = '';
            document.getElementById("id").disabled = false;
            document.getElementsByTagName("button")[0].disabled = false;
        form.reset();
        return
    }

})


const formDelete = document.querySelector('#formDelete');
const deleteButton = document.querySelector('#delete-button');
deleteButton.addEventListener('click', () => {
    const id = document.querySelector('#text-input').value;
    socket.emit('delete', id)
    formDelete.reset();
});


function loadData() {
    const id = document.getElementById("id").value;
    socket.emit('takeProduct', id);
    socket.on('productDetails', data => {

        document.getElementById("title").placeholder = data[0].title;
        document.getElementById("description").placeholder = data[0].description;
        document.getElementById("price").placeholder = data[0].price;
        document.getElementById("thumbnail").placeholder = data[0].thumbnail;
        document.getElementById("code").placeholder = data[0].code;
        document.getElementById("stock").placeholder = data[0].stock;
        document.getElementById("category").value = data[0].category;

        document.getElementById("id").disabled = true;
        document.getElementsByTagName("button")[0].disabled = true;
        document.getElementsByTagName("input")[6].value = "Actualizar";
    })
}

