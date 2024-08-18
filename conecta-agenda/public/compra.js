document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verifica la autenticación del usuario
        const response = await fetch('http://localhost:3001/api/authenticated', {
            method: 'GET',
            credentials: 'include' // Incluye cookies para manejar la sesión
        });

        if (response.ok) {
            const result = await response.json();
            if (!result.authenticated) {
                window.location.href = 'login.html'; // Redirige si no está autenticado
                return;
            }
        } else {
            console.error('Error al verificar la autenticación');
        }
    } catch (error) {
        console.error('Error al verificar la autenticación:', error);
    }

    // Maneja el clic en el botón 'Probar Producto'
    document.getElementById('probar-producto').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3001/api/send-license', {
                method: 'POST',
                credentials: 'include', // Incluye cookies para manejar la sesión
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (response.ok) {
                // Envía el correo desde el frontend usando EmailJS
                emailjs.send('service_9tokppb', 'template_ktk30bh', {
                    to_name: result.username,
                    to_email: result.email,
                    subject: 'Registro de licencia para prueba gratuita Conecta y Agenda',
                    subtitle: 'Disfruta de tu prueba de 30 días',
                    user: result.username,
                    email: result.email,
                    license: result.license
                }, 'IocrxeuloEX0NF9le').then((response) => {
                    console.log('Respuesta de EmailJS:', response);
                    alert('Licencia enviada y registrada exitosamente');
                }).catch((error) => {
                    console.error('Error al enviar el correo:', error);
                    alert('Error al enviar la licencia');
                });
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error al enviar la licencia:', error);
        }
    });
});
