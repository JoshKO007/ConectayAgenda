document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío por defecto del formulario

        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, subject, message })
            });

            if (response.ok) {
                alert('Correo enviado con éxito');
                form.reset(); // Limpia el formulario
            } else {
                alert('Error al enviar el correo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el correo');
        }
    });
});
