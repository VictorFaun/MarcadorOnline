const express = require('express');
const path = require('path');
const http = require('http');         // Necesario para Socket.IO
const socketIo = require('socket.io'); // Socket.IO
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP
const io = socketIo(server);           // Iniciar Socket.IO con el servidor

app.use(cors({
  origin: '*', // Cambia esto a la URL de tu app en producción si es necesario
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Sirve archivos estáticos como HTML, CSS, JS

// Importar las rutas de los marcadores
const marcadorRoutes = require('./routes/marcador')(io);  // Pasamos io para usar Socket.IO en las rutas
app.use('/', marcadorRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});