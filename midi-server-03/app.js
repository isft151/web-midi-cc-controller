const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const easymidi = require('easymidi');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const midiDevice = 'Client-128:Virtual RawMIDI 128:0';

// // Función para leer la configuración desde el archivo JSON
// function readConfiguration(callback) {
//     fs.readFile('../server-midi-configuration/config.json', 'utf8', (err, data) => {
//         if (err) {
//             // Si hay un error al leer el archivo, puedes manejarlo aquí.
//             console.error('Error al leer la configuración:', err);
//             callback(err, null);
//             return;
//         }

//         try {
//             // Analiza los datos JSON en un objeto JavaScript
//             const config = JSON.parse(data);
//             callback(null, config);
//         } catch (err) {
//             // Si hay un error al analizar el JSON, puedes manejarlo aquí.
//             console.error('Error al analizar la configuración JSON:', err);
//             callback(err, null);
//         }
//     });
// }

// // Usar la función para leer la configuración
// readConfiguration((err, config) => 
// {
//     if (!err) 
//     {
//         // La configuración se ha leído con éxito, puedes acceder a 'config.midiDevice' aquí.
//         midiDevice = config.midiDevice;
//         console.log('Midi Device:', config.midiDevice);
//     } 
//     else 
//     {
//         // Manejar el error si no se puede leer la configuración.
//         console.error('No se pudo leer la configuración.');
//     }
// });

// TODO HAY QUE PENSAR COMO ENVIAR ESTO UNA SOLA VEZ
const midiOutput = new easymidi.Output(midiDevice);

// Ruta raíz
app.get('/', (req,res)=>{
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
        const { ccNumber, ccValue} = data;

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
        channel: 2, // Canal 3 MIDI (cambia si es necesario)
    });

    // Cerrar la conexión MIDI después de enviar el mensaje NO CERRAR!!!!
    // midiOutput.close();

    console.log(`Enviando CC ${ccNumber} a ${midiDevice} con valor: ${ccValue}`);
}

// Iniciar el servidor en el puerto 3003
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
});