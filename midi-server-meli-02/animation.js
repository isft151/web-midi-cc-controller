document.addEventListener('DOMContentLoaded', function () {
    const wrapperEl = document.querySelector('.wrapper');
    const numberOfEls = 90;
    const ws = new WebSocket('ws://192.168.0.101:3002'); // Conexión WebSocket
  
    let inputX = 0;
    let inputY = 0;
  
    function handleInput(x, y) {
        inputX = x;
        inputY = y;
        updateCCValue(); // Llama a la función para actualizar el valor del rango
    }
  
    // Manejar eventos de mouse
    document.addEventListener('mousemove', (e) => {
        handleInput(e.clientX, e.clientY);
    });

    // Manejar eventos táctiles
    wrapperEl.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        handleInput(touch.clientX, touch.clientY);
    });

    wrapperEl.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        handleInput(touch.clientX, touch.clientY);
    });

    wrapperEl.addEventListener('touchend', () => {
        inputX = 0;
        inputY = 0;
    });

    function createEl(i) {
        let el = document.createElement('div');
        const rotate = (360 / numberOfEls) * i;
        const translateY = -50;
        const hue = Math.round(360 / numberOfEls * i);
        el.classList.add('el');
        el.style.backgroundColor = 'hsl(' + hue + ', 40%, 60%)';
        el.style.transform = 'rotate(' + rotate + 'deg) translateY(' + translateY + '%)';
        wrapperEl.appendChild(el);

        const updateAnimation = () => {
            const rect = el.getBoundingClientRect();
            const elX = rect.left + rect.width / 2;
            const elY = rect.top + rect.height / 2;
    
            const deltaX = inputX - elX;
            const deltaY = inputY - elY;
    
            const rotation = Math.atan2(deltaY, deltaX);
            const rotationDeg = (rotation * 180) / Math.PI;
    
            el.style.transform = `rotate(${rotationDeg + rotate}deg) translateY(${translateY}%)`;
        };
        
        // Escucha el evento de movimiento
        wrapperEl.addEventListener('mousemove', updateAnimation);
        wrapperEl.addEventListener('touchmove', updateAnimation);

    }
  
    function updateCCValue() {
        const ccValue = Math.round((inputX / window.innerWidth) * 127);
    
        // Envia el ccValue a través de WebSocket
        if (ws.readyState === ws.OPEN) {
            const ccMessage = JSON.stringify({ ccNumber: ccParameterSelect.value, ccValue });
            ws.send(ccMessage);
      }
    }
    
    for (let i = 0; i < numberOfEls; i++) createEl(i);
});
