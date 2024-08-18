const express = require('express');
const path = require('path');
const mysql = require('mysql2');
 
const app = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');
 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Cambia a tu usuario de MySQL
    password: 'root',  // Cambia a tu contraseña de MySQL
    database: 'ApelacionesDB'
});
 
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});
 
// Middleware para analizar datos de formularios
app.use(express.urlencoded({ extended: true }));
 
// Servir archivos estáticos
app.use(express.static(PUBLIC));
 
// Rutas para servir archivos HTML
app.get('/', (req, res) => {
    console.log('Cargando home...');
    res.sendFile(path.join(PUBLIC, 'notas.html'));
});
 
app.get('/home', (req, res) => {
    console.log('Cargando home...');
    res.sendFile(path.join(PUBLIC, 'home.html'));
});
 
app.get('/sobreNosotros', (req, res) => {
    console.log('Cargando página Sobre Nosotros...');
    res.sendFile(path.join(PUBLIC, 'sobreNosotros.html'));
});
 
app.get('/apelaciones', (req, res) => {
    console.log('Cargando página Apelaciones...');
    res.sendFile(path.join(PUBLIC, 'apelaciones.html'));
});
 
app.get('/usuarios', (req, res) => {
    console.log('Cargando página Usuarios...');
    res.sendFile(path.join(PUBLIC, 'usuarios.html'));
});
 
app.get('/apelacionesAdmin', (req, res) => {
    console.log('Cargando página ApelacionesAdmin...');
    res.sendFile(path.join(PUBLIC, 'apelacionesAdmin.html'));
});
 
// Endpoint para obtener apelaciones desde la base de datos
app.get('/api/apelaciones', (req, res) => {
    const query = `
        SELECT a.id_apelacion, u.username, a.motivo, a.estado, a.fecha
        FROM Apelaciones a
        JOIN Usuarios u ON a.id_usuario = u.id_usuario
    `;
   
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
 
// Endpoint para agregar apelaciones a la base de datos
app.post('/api/add-apelacion', (req, res) => {
    const { motivo, estado, id_usuario } = req.body;
    const query = `
        INSERT INTO Apelaciones (motivo, estado, id_usuario)
        VALUES (?, ?, ?)
    `;
 
    connection.query(query, [motivo, estado, id_usuario], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ id_apelacion: results.insertId, motivo, estado, id_usuario, fecha: new Date() });
    });
});
 
// Endpoint para obtener usuarios desde la base de datos
app.get('/api/usuarios', (req, res) => {
    const query = `
        SELECT id_usuario, username, first_name, last_name, rol
        FROM Usuarios
    `;
   
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
 
// Endpoint para agregar un nuevo usuario a la base de datos
app.post('/api/add-usuario', (req, res) => {
    const { username, first_name, last_name, password, rol } = req.body;
 
    const query = `
        INSERT INTO Usuarios (username, first_name, last_name, password, rol)
        VALUES (?, ?, ?, ?, ?)
    `;
 
    connection.query(query, [username, first_name, last_name, password, rol], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ id_usuario: results.insertId, username, first_name, last_name, rol });
    });
});
 
// Endpoint para eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const query = 'DELETE FROM Usuarios WHERE id_usuario = ?';
   
    connection.query(query, [usuarioId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ success: true });
    });
});
 
// Inicializa el servidor
app.listen(PORT, () => {
    console.log(`😊 Servidor corriendo en el puerto ${PORT}`);
});