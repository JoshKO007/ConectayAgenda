document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verifica la autenticación del usuario
        const response = await fetch('http://conectayagenda.com/api/authenticated', {
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
            alert('No se pudo verificar la autenticación. Por favor, vuelve a iniciar sesión.');
        }
    } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        alert('Se produjo un error al verificar la autenticación. Por favor, vuelve a intentar.');
    }

    // Maneja el clic en el botón 'Probar Producto'
    document.getElementById('probar-producto').addEventListener('click', async () => {
        try {
            const response = await fetch('http://conectayagenda.com/api/send-license', {
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
                alert(result.message || 'Error al enviar la licencia');
            }
        } catch (error) {
            console.error('Error al enviar la licencia:', error);
            alert('Se produjo un error al enviar la licencia. Por favor, vuelve a intentar.');
        }
    });
});
