document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verifica la autenticación del usuario
        const response = await fetch('http://localhost:3001/api/authenticated', {
            method: 'GET',
            credentials: 'include' // Incluye cookies para manejar la sesión
        });

        if (response.ok) {
            const result = await response.json();
            if (result.authenticated) {
                const loginLink = document.querySelector('.nav-links a[href="login.html"]');
                if (loginLink) {
                    loginLink.textContent = 'Cuenta';
                    loginLink.href = 'cuenta.html'; // Cambia el enlace a la página de cuenta si es necesario
                }
            }
        } else {
            console.error('Error al verificar la autenticación');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
