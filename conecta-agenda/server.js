const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const nodemailer = require('nodemailer'); // Importa nodemailer

const app = express();

// Configura body-parser para manejar datos JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'https://www.conectayagenda.com', // Tu dominio HTTPS
    credentials: true
}));

// Configura la sesión
app.use(session({
    secret: 'root', // Cambia esto por un secreto real
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de que esto esté configurado correctamente en producción
}));

// Configura el transporte de Nodemailer con variables de entorno
const transporter = nodemailer.createTransport({
    service: 'gmail', // Usa tu servicio de correo (puede ser 'gmail', 'hotmail', etc.)
    auth: {
        user: process.env.EMAIL_USER, // Usa la variable de entorno para la dirección de correo electrónico
        pass: process.env.EMAIL_PASS // Usa la variable de entorno para la contraseña o token de aplicación
    }
});

// Configura una ruta para manejar el envío de correos electrónicos
app.post('/send-email', (req, res) => {
    const { email, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER, // Usa la variable de entorno para la dirección de correo electrónico
        to: email, // Dirección de correo del destinatario
        subject: subject, // Asunto del correo
        text: message // Cuerpo del correo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
            return res.status(500).send('Error al enviar el correo');
        }
        console.log('Correo enviado:', info.response);
        res.status(200).send('Correo enviado');
    });
});

// Inicia el servidor HTTP (solo necesario para pruebas locales, no en Vercel)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
