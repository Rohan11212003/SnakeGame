document.addEventListener("DOMContentLoaded", function () {
    // Initialize variables
    let svg = document.getElementById('gameCanvas'); // Get the game canvas
    let svgNS = "http://www.w3.org/2000/svg"; // SVG namespace
    let tileSize = 20; // Size of each tile
    let canvasSize = 550; // Size of the canvas
    let moveInterval = 100; // Movement interval in milliseconds
    let keys = { left: 37, up: 38, right: 39, down: 40 }; // Key codes for arrow keys

    let snake = [{ x: 10, y: 10 }]; // Initial position of the snake
    let direction = 'right'; // Initial direction of the snake
    let food = null; // Initialize food as null
    let score = 0; // Initialize score
    let intervalId = null; // Interval ID for movement

    // High score setup
    let highScore = localStorage.getItem("highScore") || 0;
    document.getElementById('high-score').textContent = `High Score: ${highScore}`;

    // Get the start button and add click event listener to start the game
    let startButton = document.getElementById('start_button');
    startButton.addEventListener('click', init);

    // Function to initialize the game
    function init() {
        clearInterval(intervalId); // Clear any existing interval
        snake = [{ x: 10, y: 10 }]; // Reset snake position
        direction = 'right'; // Reset direction
        score = 0; // Reset score
        createFood(); // Create food
        document.addEventListener('keydown', changeDirection); // Add keydown event listener for direction change
        intervalId = setInterval(moveSnake, moveInterval); // Set interval for snake movement
        updateScoreDisplay(); // Show current and high score
    }

    // Function to create food
    function createFood() {
        let shapes = ['circle', 'square'];
        let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        food = {
            x: Math.floor(Math.random() * (canvasSize / tileSize)),
            y: Math.floor(Math.random() * (canvasSize / tileSize)),
            shape: randomShape
        };
    }

    // Function to move the snake
    function moveSnake() {
        let head = { x: snake[0].x, y: snake[0].y };

        switch (direction) {
            case 'left': head.x -= 1; break;
            case 'up': head.y -= 1; break;
            case 'right': head.x += 1; break;
            case 'down': head.y += 1; break;
        }

        // Check for collision with wall or self
        if (head.x < 0 || head.x >= canvasSize / tileSize ||
            head.y < 0 || head.y >= canvasSize / tileSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // Food collision check
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }
            food = null;
            createFood();
        } else {
            snake.pop();
        }

        draw();
    }

    // Function to draw snake and food
    function draw() {
        svg.innerHTML = '';
        drawFood();

        snake.forEach(segment => {
            let snakeSegment = document.createElementNS(svgNS, 'rect');
            snakeSegment.setAttribute('x', segment.x * tileSize);
            snakeSegment.setAttribute('y', segment.y * tileSize);
            snakeSegment.setAttribute('width', tileSize);
            snakeSegment.setAttribute('height', tileSize);
            snakeSegment.setAttribute('fill', 'green');
            svg.appendChild(snakeSegment);
        });

        updateScoreDisplay();
    }

    // Function to draw the food
    function drawFood() {
        if (food) {
            let foodElement;
            switch (food.shape) {
                case 'circle':
                    foodElement = document.createElementNS(svgNS, 'circle');
                    foodElement.setAttribute('cx', (food.x + 0.5) * tileSize);
                    foodElement.setAttribute('cy', (food.y + 0.5) * tileSize);
                    foodElement.setAttribute('r', tileSize / 2);
                    foodElement.setAttribute('fill', 'red');
                    break;
                case 'square':
                    foodElement = document.createElementNS(svgNS, 'rect');
                    foodElement.setAttribute('x', food.x * tileSize);
                    foodElement.setAttribute('y', food.y * tileSize);
                    foodElement.setAttribute('width', tileSize);
                    foodElement.setAttribute('height', tileSize);
                    foodElement.setAttribute('fill', 'red');
                    break;
            }
            svg.appendChild(foodElement);
        }
    }

    // Function to handle direction change
    function changeDirection(event) {
        if (event.keyCode === keys.up || event.keyCode === keys.down) {
            event.preventDefault();
        }

        switch (event.keyCode) {
            case keys.left:
                if (direction !== 'right') direction = 'left';
                break;
            case keys.up:
                if (direction !== 'down') direction = 'up';
                break;
            case keys.right:
                if (direction !== 'left') direction = 'right';
                break;
            case keys.down:
                if (direction !== 'up') direction = 'down';
                break;
        }
    }

    // Function to handle game over
    function gameOver() {
        clearInterval(intervalId);
        document.removeEventListener('keydown', changeDirection);
        alert(`Game Over! Your score is ${score}`);
    }

    // Function to update score and high score display
    function updateScoreDisplay() {
        document.getElementById('score').textContent = `Score : ${score}`;
        document.getElementById('high-score').textContent = `High Score: ${highScore}`;
    }
});
