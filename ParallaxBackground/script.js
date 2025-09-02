const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 10;

const backgroundImage1 = new Image();
backgroundImage1.src = './assets/layer-1.png';

const backgroundImage2 = new Image();
backgroundImage2.src = './assets/layer-2.png';

const backgroundImage3 = new Image();
backgroundImage3.src = './assets/layer-3.png';

const backgroundImage4 = new Image();
backgroundImage4.src = './assets/layer-4.png';

const backgroundImage5 = new Image();
backgroundImage5.src = './assets/layer-5.png';

class Layer {
	constructor(image, speedModifier) {
		this.x = 0;
		this.y = 0;
		this.width = 2400;
		this.height = 700;
		this.x2 = this.width;
		this.image = image;
		this.speedModifier = speedModifier;
		this.speed = gameSpeed * speedModifier;
	}
	update() {
		this.speed = gameSpeed * this.speedModifier;
		if(this.x <= -this.width) {
			this.x = this.width + this.x2 - this.speed;
		}
		if(this.x2 <= -this.width) {
			this.x2 = this.width + this.x - this.speed;
		}
		this.x = Math.floor(this.x - this.speed);
		this.x2 = Math.floor(this.x2 - this.speed);
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
	}
};

const layer4 = new Layer(backgroundImage4, 0.7)


function animate() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	layer4.update();
	layer4.draw();
	
	requestAnimationFrame(animate);
}

animate();