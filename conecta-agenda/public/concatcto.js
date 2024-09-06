document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form');
    const responseMessage = document.querySelector('#response-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                responseMessage.textContent = 'Correo enviado con éxito!';
                responseMessage.style.color = 'green';
                form.reset(); // Limpiar el formulario
            } else {
                responseMessage.textContent = 'Error al enviar el correo. Por favor, inténtalo de nuevo.';
                responseMessage.style.color = 'red';
            }
        } catch (error) {
            responseMessage.textContent = 'Error al enviar el correo. Por favor, inténtalo de nuevo.';
            responseMessage.style.color = 'red';
        }
    });
});
