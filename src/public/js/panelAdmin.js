// controlador de "Cambiar Rol"
document.querySelectorAll('.change-role-link').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const userId = link.getAttribute('data-user-id'); // Obtiene el userId del atributo data-user-id
        fetch(`/api/users/premium/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) {
                console.log('Rol de usuario cambiado con éxito');
                location.reload();
                return response.json()
            } else {
                console.error('Hubo un problema al cambiar el rol del usuario');
                return response.json()
            }
        })
        .then(data => {
            if(data.status == 'error'){
                console.log('Datos de la respuesta:', data.error);
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
    });
});
// controlador de "Eliminar User"
document.querySelectorAll('.delete-user-link').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const userId = link.getAttribute('data-user-id'); // Obtiene el userId del atributo data-user-id
        fetch(`/api/users/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) {
                console.log('Usuario eliminado con éxito');
                location.reload();
                return response.json()
            } else {
                console.error('Hubo un problema al eliminar el usuario');
                return response.json()
            }
        })
        .then(data => {
            if(data.status == 'error'){
                console.log('Datos de la respuesta:', data.error);
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
    });
});