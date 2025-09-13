const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
let gameOver = false;
ctx.font = '50px Impact'; 

let ravens = [];

class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.speedModifier = Math.random() * 0.6 + 0.2;
        this.width = this.spriteWidth * this.speedModifier;
        this.height = this.spriteHeight * this.speedModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 1 + 1;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './public/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')';
        this.hasTail = Math.random() > 0.5;
    }
    update(deltaTime) {
        if(this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltaTime
        if(this.timeSinceFlap > this.flapInterval) {
            if(this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if(this.hasTail) {
                for(let i = 0; i < 5; i++) {
                    particles.push(new Particles(this.x, this.y, this.width, this.color));
                }
            }
        }
        if(this.x < 0 - this.width) gameOver = true


    }
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];

class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = './public/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.audio = new Audio();
        this.audio.src = './public/boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltaTime) {
        if(this.frame === 0) this.audio.play();

        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5) this.markedForDeletion = true
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
    }
}

let particles = [];

class Particles {
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size/2 + Math.random() * 50 - 25;
        this.y = y + this.size/3 + Math.random() * 50 - 25;
        this.color = color;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
    }
    update(deltaTime) {
        this.x += this.speedX;
        this.radius += 0.5;
        if(this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill()
        ctx.restore()
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText('Score ' +score, 50, 75);
    ctx.fillStyle = "white";
    ctx.fillText('Score ' +score, 55, 80);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over ' +score, canvas.width/2, canvas.height/2)
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over ' +score, canvas.width/2 + 5, canvas.height/2 + 5)
}


window.addEventListener('click', function(e) {
    const detectPixelData = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelData);
    const pc = detectPixelData.data;
    ravens.forEach((object) => {
        if(object.randomColor[0] === pc[0] && object.randomColor[1] === pc[1] && object.randomColor[2] === pc[2]) {
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
            console.log(explosions);
        }
    })
})

const raven = new Raven();

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a, b) {
            return a.width - b.width;
        });
    }
    drawScore();
    [ ...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [ ...particles, ...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    if(!gameOver) requestAnimationFrame(animate);
    else drawGameOver(); 
}
animate(0);