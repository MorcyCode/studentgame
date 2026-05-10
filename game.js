const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const lengthElement = document.getElementById('length');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

const gridSize = 20;
const gridCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 1;
let dy = 0;
let score = 0;
let gameLoop = null;
let isPaused = false;

function drawSnake() {
    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * gridSize, segment.y * gridSize,
            (segment.x + 1) * gridSize, (segment.y + 1) * gridSize
        );
        if (index === 0) {
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#00cc6a');
        } else {
            const alpha = 1 - (index * 0.05);
            gradient.addColorStop(0, `rgba(0, 255, 136, ${alpha})`);
            gradient.addColorStop(1, `rgba(0, 204, 106, ${alpha})`);
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(
            segment.x * gridSize + 2,
            segment.y * gridSize + 2,
            gridSize - 4,
            gridSize - 4,
            4
        );
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function drawFood() {
    const gradient = ctx.createRadialGradient(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        0,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2
    );
    gradient.addColorStop(0, '#ff4444');
    gradient.addColorStop(1, '#cc0000');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    if (head.x < 0) head.x = gridCount - 1;
    if (head.x >= gridCount) head.x = 0;
    if (head.y < 0) head.y = gridCount - 1;
    if (head.y >= gridCount) head.y = 0;
    
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        lengthElement.textContent = snake.length;
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * gridCount),
        y: Math.floor(Math.random() * gridCount)
    };
    
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * gridCount),
            y: Math.floor(Math.random() * gridCount)
        };
    }
}

function gameOver() {
    clearInterval(gameLoop);
    alert(`游戏结束！你的分数: ${score}`);
}

function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    drawFood();
    drawSnake();
}

function update() {
    if (!isPaused) {
        moveSnake();
    }
    draw();
}

function startGame() {
    if (gameLoop) return;
    isPaused = false;
    gameLoop = setInterval(update, 200);
}

function pauseGame() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续游戏' : '暂停游戏';
}

function resetGame() {
    clearInterval(gameLoop);
    gameLoop = null;
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    isPaused = false;
    scoreElement.textContent = score;
    lengthElement.textContent = snake.length;
    spawnFood();
    pauseBtn.textContent = '暂停游戏';
    draw();
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key === 'ArrowUp' || key === 'w' || key === 'W') {
        if (dy !== 1) {
            dx = 0;
            dy = -1;
        }
    } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        if (dy !== -1) {
            dx = 0;
            dy = 1;
        }
    } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        if (dx !== 1) {
            dx = -1;
            dy = 0;
        }
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        if (dx !== -1) {
            dx = 1;
            dy = 0;
        }
    } else if (key === ' ') {
        e.preventDefault();
        pauseGame();
    }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);

resetGame();