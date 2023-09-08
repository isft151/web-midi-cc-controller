const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const easymidi = require('easymidi');
const fs = require('fs');

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

        // Función para guardar la configuración en un archivo json
        saveConfiguration(data);
    });
});

// Función para guardar la configuración en un archivo JSON
function saveConfiguration(data) {
    const config = {
        midiDevice: data.midiDevice
        // Se pueden agregar más propiedades a 'config' según sea necesario
    };

    // Convierte el objeto 'config' a una cadena JSON
    // El segundo argumento (null) es para la función de reemplazo,
    // y el tercer argumento (2) es para la sangría.
    const jsonConfig = JSON.stringify(config, null, 2); 

    // Escribe la configuración en el archivo JSON
    fs.writeFile('config.json', jsonConfig, 'utf8', (err) => 
    {
        if (err) {
            console.error('Error al guardar la configuración:', err);
        } else {
            console.log('Configuración guardada con éxito.');
        }
    });
}

// Iniciar el servidor en el puerto 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
});