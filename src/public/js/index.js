const socket = io();

// let addCartButtons = document.querySelectorAll('.btn-add');
// addCartButtons.forEach(function (button) {
//     button.addEventListener('click', function () {
//         let id = button.id;
//         console.log('Clicked on button with _id:', id);
//         socket.emit('idproduct', id)
//     });
// });

document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', async () => {
      const pid = button.getAttribute('data-product-id');
      const cid = button.getAttribute('data-user-cart');

      try {
        // Realiza una solicitud POST utilizando la función fetch o una biblioteca como Axios
        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
          method: 'POST',
          body: JSON.stringify({ pid, cid }), // Envía _id y userCart
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          console.log('Producto agregado al carrito con éxito');
        } else {
          console.error('Hubo un problema al agregar el producto al carrito');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    });
  });
