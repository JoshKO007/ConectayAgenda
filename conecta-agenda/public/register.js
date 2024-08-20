document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'error-message';
    errorMessageDiv.style.color = 'red';
    errorMessageDiv.style.display = 'none';
    form.insertBefore(errorMessageDiv, form.firstChild);

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene el comportamiento predeterminado del formulario

        // Limpia el mensaje de error
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';

        // Obtén los datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validaciones
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

        // Envía los datos al servidor para el registro
        try {
            const response = await fetch('http://conectayagenda.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data['confirm-password'], // Asegúrate de incluir confirmPassword en el cuerpo de la solicitud
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                form.reset(); // Limpia el formulario después de un registro exitoso
                window.location.href = 'login.html'; // Redirige a la página de inicio de sesión
            } else {
                const error = await response.json();
                errorMessageDiv.textContent = 'Error: ' + error.message;
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessageDiv.textContent = 'Error al registrar el usuario';
            errorMessageDiv.style.display = 'block';
        }
    });
});
