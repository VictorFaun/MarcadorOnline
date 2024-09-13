const express = require('express');
const router = express.Router();
const path = require('path');

let marcadores = {}; // Aquí puedes almacenar los marcadores temporalmente

module.exports = (io) => {

    // Manejo de conexiones de WebSocket
io.on('connection', (socket) => {
    console.log('Nueva conexión de WebSocket');
  
    // El cliente se une a una sala específica basada en el ID del marcador
    socket.on('joinMarcador', (marcadorId) => {
      socket.join(marcadorId);
      console.log(`Usuario unido al marcador ${marcadorId}`);
  
      // Puedes enviarle los datos actuales del marcador al conectarse
      if (marcadores[marcadorId]) {
        socket.emit('actualizarMarcador', marcadores[marcadorId]);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });
  

  // POST /configuracion/marcador: Crea o actualiza un marcador
  router.post('/marcador', (req, res) => {
    let { id, equipoLocal, equipoVisita, estado, puntosLocal, puntosVisita, setsLocal, setsVisita, saque, winLocal, winVisita, invert, modo } = req.body;
    if(!id){
        id = generateUniqueId();
    }

    marcadores[id] = {
      equipoLocal,
      equipoVisita,
      estado,
      puntosLocal,
      puntosVisita,
      setsLocal,
      setsVisita,
      saque,
      winLocal,
      winVisita,
      modo,
      invert
    };
    // Emitir un evento a través de Socket.IO para actualizar el marcador en tiempo real
    io.to(id).emit('actualizarMarcador', marcadores[id]);

    res.json({ id });

  });

  // GET /marcador/:id: Devuelve la página del marcador y se conecta a WebSocket
  router.get('/marcador/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Enviar la página del marcador
  });

  // GET /valida/marcador/:id: Devuelve la página del marcador y se conecta a WebSocket
  router.get('/valida/marcador/:id', (req, res) => {
    const id = req.params.id;
    if(marcadores[id]){
      res.status(200).send({...marcadores[id], id});
    }else{
      res.status(404).send();
    }
  });

  router.use((req, res) => {
    res.status(404).send('Página no encontrada');
  });

  function generateUniqueId() {
    return Date.now()+"";
  }

  return router;
};