document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'error-message';
    errorMessageDiv.style.color = 'red';
    errorMessageDiv.style.display = 'none';
    form.insertBefore(errorMessageDiv, form.firstChild);

    const testDBConnection = async () => {
        try {
            const response = await fetch('https://www.conectayagenda.com/api/test-db');
            if (response.ok) {
                const result = await response.json();
                console.log('Prueba de conexión a la base de datos:', result.message);
            } else {
                console.error('Error al probar la conexión a la base de datos. Código de estado:', response.status);
                const errorText = await response.text();
                console.error('Texto de error:', errorText);
            }
        } catch (error) {
            console.error('Error en la solicitud de prueba de conexión:', error);
        }
    };

    testDBConnection();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!/^[a-zA-Z0-9]+$/.test(data.username)) {
            errorMessageDiv.textContent = 'El nombre de usuario solo puede contener letras y números.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        if (data.password !== data['confirm-password']) {
            errorMessageDiv.textContent = 'Las contraseñas no coinciden.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('https://www.conectayagenda.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data['confirm-password']
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                form.reset();
                window.location.href = 'login.html';
            } else {
                const errorText = await response.text();
                try {
                    const error = JSON.parse(errorText);
                    errorMessageDiv.textContent = 'Error: ' + error.message;
                } catch (jsonError) {
                    errorMessageDiv.textContent = 'Error desconocido: ' + errorText;
                }
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessageDiv.textContent = 'Error al registrar el usuario';
            errorMessageDiv.style.display = 'block';
        }
    });
});
