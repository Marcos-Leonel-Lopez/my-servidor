const socket = io();



let addCartButtons = document.querySelectorAll('.btn-add');
addCartButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        let id = button.id;
        console.log('Clicked on button with _id:', id);
        socket.emit('idproduct', id)
    });
});

