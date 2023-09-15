const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const easymidi = require('easymidi');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const midiOutput = new easymidi.Output('Client-128:Virtual RawMIDI 128:0');

app.use(express.static(__dirname)); 

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  // Manejo de mensajes desde el navegador
  ws.on('message', (message) => {
    console.log(`Mensaje recibido del navegador: ${message}`);

    // Analizar el mensaje JSON
    const data = JSON.parse(message);
    const { ccNumber, ccValue } = data;

    // Enviar el mensaje MIDI CC al dispositivo seleccionado
    sendMidiCC(ccNumber, ccValue);
  });
});

// Función para enviar un mensaje MIDI CC
function sendMidiCC(ccNumber, ccValue) {
  // Enviar el mensaje MIDI CC
  midiOutput.send('cc', {
    controller: ccNumber,
    value: ccValue,
    channel: 2, // Canal MIDI 3 (cambia si es necesario)
  });

  console.log(`Enviando CC ${ccNumber} a Client-128:Virtual RawMIDI 128:0: ${ccValue}`);
}

// Iniciar el servidor en el puerto 3003
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
});
