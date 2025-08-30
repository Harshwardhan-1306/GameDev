/**@type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d")

CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 100;
const enemyArray = [];

const enemyImage = new Image();
enemyImage.src = "./public/enemy1.png";

class Enemy {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.speed = (Math.random() * 4) - 2;
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 3;
        this.height = this.spriteHeight / 3;
    }
    update() {
        this.x += this.speed;
        this.y += this.speed;
    }
    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(enemyImage, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for(let i = 0; i < numberOfEnemies; i++) {
    enemyArray.push(new Enemy());
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    enemyArray.forEach(enemy => {
        enemy.update(),
        enemy.draw()
    });
    requestAnimationFrame(animate);
}

animate();
