const socket = io();

document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', async () => {
      const pid = button.getAttribute('data-product-id');
      const cid = button.getAttribute('data-user-cart');
      try {
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
