interface Point {
    x: number;
    y: number;
}

let snake: Point[] = [{ x: 2, y: 2 }];
let direction: Point = { x: 1, y: 0 };
let food: Point = generateFood();
let gameStarted: boolean = false;
let buttonACounter: number = 0;
let buttonBCounter: number = 0;

function generateFood(): Point {
    let newFood: Point;
    do {
        newFood = { x: Math.floor(Math.random() * 5), y: Math.floor(Math.random() * 5) };
    } while (isPointOnSnake(newFood));
    return newFood;
}

function isPointOnSnake(point: Point): boolean {
    return snake.some(segment => segment.x === point.x && segment.y === point.y);
}

function updateSnake(): void {
    if (!gameStarted) {
        return;
    }

    const newHead: Point = {
        x: (snake[0].x + direction.x + 5) % 5,
        y: (snake[0].y + direction.y + 5) % 5
    };

    if (isPointOnSnake(newHead)) {
        basic.showIcon(IconNames.Skull); // Game over
        basic.pause(2000);
        resetGame();
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }
}

function resetGame(): void {
    snake = [{ x: 2, y: 2 }];
    direction = { x: 1, y: 0 };
    food = generateFood();
    gameStarted = false;
}

function draw(): void {
    if (!gameStarted) {
        return;
    }

    basic.clearScreen();
    snake.forEach(segment => led.plot(segment.x, segment.y));
    led.plot(food.x, food.y);
}

function checkButtonPresses(): void {
    if (buttonACounter > 0) {
        if (--buttonACounter === 0) {
            turnSnake({ x: 0, y: -1 }); // Turn up
        }
    }
    if (buttonBCounter > 0) {
        if (--buttonBCounter === 0) {
            turnSnake({ x: 0, y: 1 }); // Turn down
        }
    }
}

function turnSnake(newDirection: Point): void {
    if (!gameStarted || (newDirection.x === -direction.x && newDirection.y === -direction.y)) {
        return;
    }

    direction = newDirection;
}

input.onButtonPressed(Button.A, function () {
    if (buttonACounter > 0) {
        turnSnake({ x: -1, y: 0 }); // Turn left on double press
        buttonACounter = 0;
    } else {
        buttonACounter = 5; // Set counter for double press detection
    }
});

input.onButtonPressed(Button.B, function () {
    if (buttonBCounter > 0) {
        turnSnake({ x: 1, y: 0 }); // Turn right on double press
        buttonBCounter = 0;
    } else {
        buttonBCounter = 5; // Set counter for double press detection
    }
});

input.onButtonPressed(Button.AB, function () {
    gameStarted = true;
});

basic.forever(function () {
    updateSnake();
    checkButtonPresses();
    draw();
    basic.pause(300);
});