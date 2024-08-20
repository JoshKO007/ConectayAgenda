document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'error-message';
    errorMessageDiv.style.color = 'red';
    errorMessageDiv.style.display = 'none';
    form.insertBefore(errorMessageDiv, form.firstChild);

    const showError = (message) => {
        errorMessageDiv.textContent = 'Error: ' + message;
        errorMessageDiv.style.display = 'block';
    };

    const hideError = () => {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        hideError();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validaciones
        if (!/^[a-zA-Z0-9]+$/.test(data.username)) {
            showError('El nombre de usuario solo puede contener letras y números.');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            showError('Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (data.password !== data['confirm-password']) {
            showError('Las contraseñas no coinciden.');
            return;
        }

        if (data.password.length < 8) {
            showError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        try {
            // Unificación de la verificación del nombre de usuario y correo electrónico
            const checkResponse = await fetch('http://conectayagenda.com/api/check-availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: data.username, email: data.email }),
            });

            if (!checkResponse.ok) {
                const error = await checkResponse.json();
                showError(error.message);
                return;
            }

            const response = await fetch('http://conectayagenda.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data['confirm-password'],
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                form.reset();
                window.location.href = 'login.html';
            } else {
                const error = await response.json();
                showError(error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Error al registrar el usuario');
        }
    });
});
