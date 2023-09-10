const clearCartButton = document.querySelector('.btn-add');
if (clearCartButton) {
    clearCartButton.addEventListener('click', async () => {
        const userCart = clearCartButton.getAttribute('data-user-cart');
        try {
            const response = await fetch(`/api/carts/${userCart}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                console.log('Carrito limpiado con éxito');
                location.reload();
            } else {
                console.error('Hubo un problema al limpiar el carrito');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
}