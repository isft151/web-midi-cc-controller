 /**
* Copyright (c) 2023 ISFT151. All rights reserved.
* Released under the MIT license
* https://opensource.org/licenses/MIT
**/

// Acceder a los elementos HTML
const transponse = document.getElementById('transponse');
const tune = document.getElementById('tune');
const cutoff = document.getElementById('cutoff');
const resonance = document.getElementById('resonance');
const outputSelect = document.getElementById('midi-output-select');

// Función para enviar el mensaje CC al dispositivo seleccionado
function sendCCMessage(ccNumber, ccValue) {
    const selectedOutputDevice = outputSelect.value;
    const ccMessage = [0xB0, ccNumber, ccValue]; // Channel 1, Control Change
    navigator.requestMIDIAccess()
        .then(access => {
            const outputs = access.outputs.values();
            for (let output of outputs) {
                if (output.name === selectedOutputDevice) {
                    output.send(ccMessage);
                }
            }
        });
}

// Manejar el cambio de valor del slider CC3 VCO1 transpose
transponse.addEventListener('input', () => {
    sendCCMessage(3, transponse.value);
});

// Manejar el cambio de valor del slider CC9 VCO1 tune
tune.addEventListener('input', () => {
    sendCCMessage(9, transponse.value);
});

// Manejar el cambio de valor del slider CC74 Cutoff
cutoff.addEventListener('input', () => {
    sendCCMessage(74, cutoff.value);
});

// Manejar el cambio de valor del slider CC71 Resonance
resonance.addEventListener('input', () => {
    sendCCMessage(42, resonance.value);
});

// Obtener los dispositivos MIDI de salida disponibles y agregarlos al select
navigator.requestMIDIAccess()
    .then(access => {
        const outputs = access.outputs.values();
        for (let output of outputs) {
            const option = document.createElement('option');
            option.value = output.name;
            option.text = output.name;
            outputSelect.appendChild(option);
        }
    });
