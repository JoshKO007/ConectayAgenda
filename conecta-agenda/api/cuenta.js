document.addEventListener('DOMContentLoaded', async () => {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const cerrarSesionBtn = document.getElementById('cerrarsesion');

    try {
        // Verifica la autenticación del usuario
        const response = await fetch('http://conectayagenda.com/api/authenticated', {
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
            alert('No se pudo verificar la autenticación. Por favor, vuelve a iniciar sesión.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Se produjo un error al verificar la autenticación. Por favor, vuelve a intentar.');
    }

    // Obtiene la información del usuario
    try {
        const response = await fetch('http://conectayagenda.com/api/user-info', {
            method: 'GET',
            credentials: 'include' // Incluye cookies para manejar sesiones
        });

        if (response.ok) {
            const data = await response.json();
            usernameInput.value = data.username;
            emailInput.value = data.email;
        } else {
            console.error('Error al obtener la información del usuario');
            alert('No se pudo obtener la información del usuario. Por favor, vuelve a intentarlo.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Se produjo un error al obtener la información del usuario. Por favor, vuelve a intentar.');
    }

    // Función para restablecer la contraseña
    resetPasswordBtn.addEventListener('click', () => {
        window.location.href = 'reset-password.html'; // Redirige a la página de restablecimiento de contraseña
    });

    // Función para cerrar sesión
    cerrarSesionBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('http://conectayagenda.com/api/logout', {
                method: 'POST',
                credentials: 'include' // Incluye cookies para manejar la sesión
            });

            if (response.ok) {
                // Cambia el enlace del menú de navegación a "Iniciar sesión"
                const loginLink = document.querySelector('.nav-links a[href="cuenta.html"]');
                if (loginLink) {
                    loginLink.textContent = 'Iniciar sesión';
                    loginLink.href = 'login.html'; // Cambia el enlace a la página de inicio de sesión
                }
                // Redirige al usuario a la página de inicio de sesión
                window.location.href = 'login.html';
            } else {
                console.error('Error al cerrar sesión');
                alert('No se pudo cerrar la sesión. Por favor, vuelve a intentarlo.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Se produjo un error al cerrar sesión. Por favor, vuelve a intentar.');
        }
    });
});

