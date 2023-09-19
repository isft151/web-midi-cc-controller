// Variables del juego
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 15; // Tamaño de la cuadrícula más pequeño
const snakeSpeed = 100; // Velocidad de movimiento de la serpiente (más lenta)

let snake = [{ x: 5, y: 5 }]; // Inicialmente, la serpiente tiene una posición
let food = { x: 10, y: 10 }; // Posición inicial de la comida
let dx = 1;
let dy = 0;
let isEating = false;
let isGameOver = false;

// Función para mostrar el mensaje de "Game Over"
function showGameOverMessage() {
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (gameOverMessage) {
        gameOverMessage.textContent = '¡Game Over!';
        // Otros cambios relacionados con el mensaje de Game Over
    }
}


// Función para dibujar la cabeza de la serpiente con efecto de transición
function drawHead() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(snake[0].x * tileSize + tileSize / 2, snake[0].y * tileSize + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Función para dibujar el cuerpo de la serpiente con efecto de transición
function drawBody() {
    ctx.fillStyle = 'lightgreen';
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * tileSize, snake[i].y * tileSize, tileSize, tileSize);
    }
}

// Función para dibujar la cola de la serpiente con efecto de transición
function drawTail() {
    ctx.fillStyle = 'green';
    ctx.fillRect(
        snake[snake.length - 1].x * tileSize + tileSize / 4,
        snake[snake.length - 1].y * tileSize + tileSize / 4,
        tileSize / 2,
        tileSize / 2
    );
}

// Función para dibujar la comida con efecto visual cuando se come
function drawFood() {
    if (isEating) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
        ctx.fill();
        canvas.classList.add('blink'); // Agregar clase para el efecto de parpadeo
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
        canvas.classList.remove('blink'); // Quitar clase para detener el parpadeo
    }
}

// Función para mover la serpiente y emitir partículas
function moveSnake() {
    if (isGameOver) return; // Evitar movimientos después de perder

    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);

    // Evento de teclado para controlar el movimiento
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' && dy !== 1) {
            dx = 0;
            dy = -1;
        } else if (event.key === 'ArrowDown' && dy !== -1) {
            dx = 0;
            dy = 1;
        } else if (event.key === 'ArrowLeft' && dx !== 1) {
            dx = -1;
            dy = 0;
        } else if (event.key === 'ArrowRight' && dx !== -1) {
            dx = 1;
            dy = 0;
        }
    });

    // Evento táctil para controlar el movimiento en dispositivos móviles
    let touchStartX, touchStartY;

    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });

    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Evitar movimientos opuestos
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && dx !== -1) {
                dx = 1;
                dy = 0;
            } else if (deltaX < 0 && dx !== 1) {
                dx = -1;
                dy = 0;
            }
        } else {
            if (deltaY > 0 && dy !== -1) {
                dx = 0;
                dy = 1;
            } else if (deltaY < 0 && dy !== 1) {
                dx = 0;
                dy = -1;
            }
        }

        touchStartX = touchEndX;
        touchStartY = touchEndY;
    });

    // Verificar si la serpiente comió la comida
    if (newHead.x === food.x && newHead.y === food.y) {
        isEating = true;
        setTimeout(() => {
            isEating = false;
        }, 100); // Tiempo del efecto de comer

        // Generar nueva comida aleatoria
        food.x = Math.floor(Math.random() * (canvas.width / tileSize));
        food.y = Math.floor(Math.random() * (canvas.height / tileSize));
    } else {
        // Si no comió, eliminar la cola y emitir partículas
        const tail = snake.pop();
    };

    checkCollision();
}

// Función para verificar colisiones
function checkCollision() {
    const head = snake[0];

    // Colisión con las paredes
    if (
        head.x < 0 || head.x >= canvas.width / tileSize ||
        head.y < 0 || head.y >= canvas.height / tileSize
    ) {
        clearInterval(gameLoop);
        isGameOver = true;
        showGameOverMessage();
    }

    // Colisión con el cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(gameLoop);
            isGameOver = true;
            showGameOverMessage();
        }
    }
}

// Función para modificar los parámetros MIDI
function modifyRange() {
    const head = snake[0];

    // Rango 1: ASPLAYEDALLOCATION
    const posicionRange = document.getElementById("ASPLAYEDALLOCATION");
    const valorRango = (head.x / (canvas.width / tileSize)) * 127; // Convierte la posición de la cabeza en el rango de 0-127
    posicionRange.value = valorRango.toFixed(0); // Redondea el valor y lo establece en la barra

    // Rango 2: BANDPASS
    const posicionRange2 = document.getElementById("BANDPASS");
    const valorRango2 = (head.y / (canvas.height / tileSize)) * 127; // Convierte la posición de la cabeza en el rango de 0-127
    posicionRange2.value = valorRango2.toFixed(0); // Redondea el valor y lo establece en la barra
}


// Función principal de actualización del juego
function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBody();
    drawFood();
    drawTail();
    drawHead();
    moveSnake();
    modifyRange();
    checkCollision();
}

// Generar el bucle del juego
let gameLoop = setInterval(updateGameArea, snakeSpeed);
