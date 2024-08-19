const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql2');
const session = require('express-session');
const cors = require('cors');

// Configura Express
const app = express();
const port = 80; // Cambia al puerto 80 para HTTP

// Configura body-parser para manejar datos JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://conectayagenda.com',
    credentials: true
}));

// Configura la sesión
app.use(session({
    secret: 'root', // Cambia esto por un secreto real
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // No se usa HTTPS, así que 'secure' debe ser false
}));

// Configura la conexión a la base de datos
const db = mysql.createConnection({
    host: '34.132.192.215',
    user: 'Josh',
    password: 'root',
    database: 'servicios'
});

// Conecta a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Función para cifrar en SHA-256
const hashSHA256 = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

// Función para cifrar en MD5
const hashMD5 = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
};

// Ruta para el registro
app.post('/api/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const randomValue = crypto.randomBytes(16).toString('hex');
    const id = generateID(username, randomValue);
    const hashedPassword = hashSHA256(password);

    const query = 'INSERT INTO Usuarios (ID, usuario, correo, password) VALUES (?, ?, ?, ?)';
    db.query(query, [id, username, email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
});

// Ruta para verificar si el usuario está autenticado
app.get('/api/authenticated', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ authenticated: true, username: req.session.user.username });
    } else {
        res.status(200).json({ authenticated: false });
    }
});

// Ruta para el inicio de sesión
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica si el nombre de usuario existe y obtiene el ID del usuario
    const queryUser = 'SELECT ID, password FROM Usuarios WHERE usuario = ?';
    db.query(queryUser, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Extrae el ID y la contraseña cifrada del usuario
        const { ID, password: hashedPasswordFromDB } = results[0];

        // Cifra la contraseña ingresada por el usuario
        const hashedPasswordInput = hashSHA256(password);

        // Compara la contraseña cifrada del usuario ingresado con la de la base de datos
        if (hashedPasswordInput === hashedPasswordFromDB) {
            req.session.user = { username }; // Almacena la información del usuario en la sesión
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Ruta para obtener la información del usuario
app.get('/api/user-info', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    const { username } = req.session.user;

    const query = 'SELECT usuario, correo FROM Usuarios WHERE usuario = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error al obtener la información del usuario' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { usuario, correo } = results[0];
        res.status(200).json({ username: usuario, email: correo });
    });
});

// Ruta para enviar la licencia y registrar en la base de datos
app.post('/api/send-license', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    const username = req.session.user.username;

    db.query('SELECT usuario, correo FROM Usuarios WHERE usuario = ?', [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error al obtener la información del usuario' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { usuario, correo } = results[0];
        const license = hashMD5(`${username}:${correo}`).slice(0, 10);

        const queryInsertLicense = 'INSERT INTO licencias (usuario_id, licencia) VALUES ((SELECT ID FROM Usuarios WHERE usuario = ?), ?)';
        db.query(queryInsertLicense, [username, license], (err, results) => {
            if (err) {
                console.error('Error al insertar licencia en la base de datos:', err);
                return res.status(500).json({ message: 'Error al registrar la licencia' });
            }

            res.status(200).json({ message: 'Licencia generada', license, username, email: correo });
        });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
