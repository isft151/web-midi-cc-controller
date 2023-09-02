 /**
* Copyright (c) 2023 ISFT151. All rights reserved.
* Released under the MIT license
* https://opensource.org/licenses/MIT
**/

//HTML Elements access.
const ASPLAYEDALLOCATION = document.getElementById('ASPLAYEDALLOCATION');
const BANDPASS = document.getElementById('BANDPASS');
const BENDLFORATE = document.getElementById('BENDLFORATE');
const BENDOSC2 = document.getElementById('BENDOSC2');
const BENDRANGE = document.getElementById('BENDRANGE');
const BRIGHTNESS = document.getElementById('BRIGHTNESS');
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

/**Inputs event listeners: */
//ASPLAYEDALLOCATION
ASPLAYEDALLOCATION.addEventListener('input', () => {
    sendCCMessage(21, ASPLAYEDALLOCATION.value);
});

//BANDPASS
BANDPASS.addEventListener('input', () => {
    sendCCMessage(105, BANDPASS.value);
});

//BENDLFORATE
BENDLFORATE.addEventListener('input', () => {
    sendCCMessage(75, BENDLFORATE.value);
});

//BENDOSC2
BENDOSC2.addEventListener('input', () => {
    sendCCMessage(34, BENDOSC2.value);
});

//BENDRANGE
BENDRANGE.addEventListener('input', () => {
    sendCCMessage(118, BENDRANGE.value);
});

//BRIGHTNESS
BRIGHTNESS.addEventListener('input', () => {
    sendCCMessage(62, BRIGHTNESS.value);
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
