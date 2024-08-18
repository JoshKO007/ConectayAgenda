document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
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

        // Cifra la contraseña en SHA-256 antes de enviarla
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data.password);
        const hashedBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashedPasswordHex = Array.from(new Uint8Array(hashedBuffer))
                                      .map(b => b.toString(16).padStart(2, '0'))
                                      .join('');

        // Envía los datos al servidor
        try {
            const response = await fetch('http://conectayagenda.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    password: hashedPasswordHex, // Enviar la contraseña cifrada
                }),
                credentials: 'include' // Asegúrate de incluir cookies para manejar sesiones
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                window.location.href = 'index.html'; // Redirige al índice después de un inicio de sesión exitoso
            } else {
                const error = await response.json();
                errorMessageDiv.textContent = 'Error: ' + error.message;
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessageDiv.textContent = 'Error al iniciar sesión';
            errorMessageDiv.style.display = 'block';
        }
    });
});
