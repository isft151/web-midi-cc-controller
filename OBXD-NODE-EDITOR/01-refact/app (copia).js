const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const easymidi = require('easymidi');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Ruta raíz
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});
// Obtener la lista de dispositivos MIDI disponibles
function getMidiDevices() {
    const devices = easymidi.getOutputs();
    return devices.map(name => ({ name }));
}

// Ruta para obtener la lista de dispositivos MIDI
app.get('/midi-devices', (req, res) => {
    const devices = getMidiDevices();
    res.json(devices);
});

// Conexiones WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');

    // Manejo de mensajes desde el navegador
    ws.on('message', (message) => {
        console.log(`Mensaje recibido del navegador: ${message}`);

        // Analizar el mensaje JSON
        const data = JSON.parse(message);
        const { ccNumber, ccValue, midiDevice } = data;

        // Enviar el mensaje MIDI CC al dispositivo seleccionado
        sendMidiCC(ccNumber, ccValue, midiDevice);
    });
});

// Función para enviar un mensaje MIDI CC
function sendMidiCC(ccNumber, ccValue, midiDevice) {
    const output = new easymidi.Output(midiDevice);
    console.log(midiDevice);
    // Enviar el mensaje MIDI CC
    output.send('cc', {
        controller: ccNumber,
        value: ccValue,
        channel: 0, // Canal MIDI (cambia si es necesario)
    });

    // Cerrar la conexión MIDI después de enviar el mensaje
    output.close();

    console.log(`Enviando CC ${ccNumber} a ${midiDevice}: ${ccValue}`);
}

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
});