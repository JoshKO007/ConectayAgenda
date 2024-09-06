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
    methods: ['GET', 'POST'], // Asegúrate de que el método POST está permitido
    credentials: true
}));

// Configura la sesión
app.use(session({
    secret: 'root', // Cambia esto por un secreto real
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Asegúrate de que esté configurado correctamente en producción
}));


// Inicia el servidor en el puerto proporcionado por Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
