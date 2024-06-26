"use strict";

// Open source code for the "3D" grid background adapted from https://codepen.io/mattjroberts/pen/pazNdx

let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

let color = "rgba(0, 255, 255,";

// Define class for horizontal lines drawing
let HorizontalArray = [];
class Horizontal {
	constructor(y) {
		this.y = y;
		this.dy = 0.5;
		this.opacity = 0;

		this.draw = () => {
			c.beginPath();
			c.lineWidth = 3;
			c.strokeStyle = `, ${this.opacity})`;
			c.moveTo(0, this.y);
			c.lineTo(canvas.width, this.y);
			c.stroke();
		};

		this.update = () => {
			if (this.y >= canvas.height) {
				HorizontalArray.splice(HorizontalArray.indexOf(this), 1);
			}
			this.opacity += 0.003;

			this.dy += 0.05;
			this.y += this.dy;
			this.draw();
		};
	}
}


// Define class for vertical lines drawing
let grad = c.createLinearGradient(0, canvas.height, 0, 0);
grad.addColorStop("0", `${color} 0.5)`);
grad.addColorStop("0.55", `${color} 0)`);
grad.addColorStop("1.0", `${color} 0)`);
let VerticalArray = [];
class Vertical {
	constructor(x) {
		this.x = x;

		this.draw = () => {
			c.beginPath();
			c.lineWidth = 3;
			c.strokeStyle = grad;
			c.moveTo(canvas.width / 2, 200);
			c.lineTo(this.x, canvas.height);
			c.stroke();
		};

		this.update = () => {
			this.draw();
		};
	}
}

// Create initial lines vertical lines
let interval = (canvas.width / 10);
let cross = 0 - interval * 8;
for (let i = 0; i < 27; i++) {
	VerticalArray.push(new Vertical(cross));
	cross += interval;
}

// Attempts to fix bug in original source causing lines to build up even when page is unfocused
let lineSpawner = setInterval(() => {
	HorizontalArray.push(new Horizontal(canvas.height / 2));
}, 300);

// Animation loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < HorizontalArray.length; i++) {
		HorizontalArray[i].update();
	}
	for (let i = 0; i < VerticalArray.length; i++) {
		VerticalArray[i].update();
	}
}


animate();