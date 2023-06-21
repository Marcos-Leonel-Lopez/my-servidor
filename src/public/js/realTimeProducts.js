const socket = io();

socket.on('productList', data => {

    const tabla = document.querySelector('#my-container');
    var filas = data.map(function (item) {
        return "<tr><td>" + item._id + "</td><td>" + item.title + "</td><td>" + item.price + "</td><td>" + item.category + "</td><td>" + item.stock + "</td><td>" + item.code + "</td></tr>";
    });

    tabla.innerHTML = filas.join("");
})