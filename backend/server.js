const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'edcord_db',
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos XAMPP:', err.message);
        console.log('¿Está encendido el módulo MySQL en tu panel de control de XAMPP?');
    } else {
        console.log('Conexión exitosa a la base de datos MySQL de XAMPP.');
    }
});

app.post('/api/contacto', (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;

    if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO contactos (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, asunto, mensaje], (err, result) => {
        if (err) {
            console.error('Error al guardar en base de datos:', err);
            return res.status(500).json({ error: 'Error al procesar tu solicitud. Por favor intenta más tarde.' });
        }
        console.log('Nuevo mensaje de contacto guardado en BD:', { nombre, email, asunto, mensaje });
        res.status(200).json({ message: 'Mensaje enviado y guardado correctamente' });
    });
});
app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
    console.log('La página web está siendo servida. Abre http://localhost:3000 en tu navegador.');
});
