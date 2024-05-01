"use strict";

const gridSize = 11;
let playerPosition;
let blocks;
let solutions;
let walls;
let level = 1;
let isMoving = false;

document.addEventListener("DOMContentLoaded", () => {
	const grid = document.getElementById("gameGrid");
	for (let i = 0; i < gridSize * gridSize; i++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		grid.appendChild(cell);
	}

	// let audio = new Audio('/gridGame/devmusic.mp3');
	// audio.loop = true;
	// const promise = audio.play();

	// Start game
	setupGame();
});

const setupGame = () => {
	function generateColor() {
		// Generate a random color using HSL to ensure high contrast
		const h = Math.floor(Math.random() * 360);
		const s = Math.floor(Math.random() * 50) + 50;
		const l = Math.floor(Math.random() * 30) + 50;
		return `hsl(${h}, ${s}%, ${l}%)`;
	}

	if (level === 1) {
		walls = new Set([
			"0,1",
			"0,0",
			"2,1",
			"3,1",
			"4,1",
			"8,4",
			"5,1",
			"6,1",
			"7,1",
			"8,1",
			"9,1",
			"11,1",
			"11,2",
			"11,0",
			"3,7",
			"4,7",
		]);
		blocks = [
			{ x: 4, y: 3, color: generateColor() },
			{ x: 4, y: 6, color: generateColor() },
		];
		solutions = [
			{ x: 3, y: 5 },
			{ x: 5, y: 6 },
		];
		playerPosition = { x: 1, y: 1 };
	} else if (level === 2) {
		walls = new Set([
			"0,1",
			"0,0",
			"2,1",
			"3,1",
			"4,1",
			"8,4",
			"5,1",
			"6,1",
			"7,1",
			"8,1",
			"9,1",
			"11,1",
			"11,0",
			"3,7",
		]);
		blocks = [
			{ x: 4, y: 3, color: generateColor() },
			{ x: 4, y: 6, color: generateColor() },
		];
		solutions = [
			{ x: 3, y: 5 },
			{ x: 5, y: 6 },
		];
		playerPosition = { x: 1, y: 1 };
	}

	solutions.forEach((solution, index) => {
		solution.color = blocks[index].color;
	});
	updateGame();
	isMoving = false; // Reenable movement between levels
};

const inWall = (position) => {
	return blocks.some((block) => position.x === block.x && position.y === block.y);
};
const inSolution = (position) => {
	return solutions.some((solution) => position.x === solution.x && position.y === solution.y);
};
const inBounds = (position) => {
	return (position.x >= 0
		&& position.x < gridSize
		&& position.y >= 0
		&& position.y < gridSize
		&& !walls.has(`${position.x},${position.y}`)
	);
};
const movePlayer = (dx, dy) => {
	if (isMoving) return;
	const newPosition = { x: playerPosition.x + dx, y: playerPosition.y + dy };

	if (inBounds(newPosition)) {
		isMoving = true;

		const cellSize = document.querySelector(".cell").offsetWidth;
		const translateX = dx * cellSize;
		const translateY = dy * cellSize;
		
		// Check collision and if player moves into a block
		let collision = false;
		blocks.forEach((block, index) => {
			// Check if the player is moving into any block
			if (newPosition.x === block.x && newPosition.y === block.y) {
				let blockMoved = false;
				let newBlockPosition = { x: block.x + dx, y: block.y + dy };
				while (
					inBounds(newBlockPosition) &&
					!inWall(newBlockPosition) &&
					!inSolution(newBlockPosition)
				) {
					newBlockPosition.x += dx;
					newBlockPosition.y += dy;
					blockMoved = true;
				}
				// Push the block until it hits the edge/wall, or another block
				if (inSolution(newBlockPosition))
					blocks[index] = {
						x: newBlockPosition.x,
						y: newBlockPosition.y,
						color: blocks[index].color,
					};
				else
					blocks[index] = {
						x: newBlockPosition.x - dx,
						y: newBlockPosition.y - dy,
						color: blocks[index].color,
					};

				animatePlayerHit(blockMoved, () => {
					isMoving = false;
					updateGame();
				}, dx);
				collision = true;
			}
		});

		// If did not collide with anything, player was able to move
		if (!collision) {
			playerPosition = newPosition;
			// Freeze movement to allow for movement animation to play
			animatePlayerMovement(translateX, translateY, () => {
				isMoving = false;
				updateGame();
			});
		}
	}
};

let direction;
let lastDirection = 1;
const animatePlayerMovement = (dx, dy, callback) => {
	direction = dx;
	const sprite = document.querySelector(".player .sprite");
	if (sprite) {
		const translation = `translate(${dx}px, ${dy}px)`;

		sprite.style.transition = "transform 100ms ease-in";
		sprite.style.transform = translation;
		// Replace the sprite with a gif, ensuring the gif is restarted
		sprite.style.background = `url('gridGame/move.gif?${new Date().getTime()}') no-repeat center center`;
		sprite.style.backgroundSize = "cover";

		if (dx > 0) {
			sprite.style.transform += " scaleX(-1)";
			lastDirection = -1;
		} else if (dx < 0) {
			sprite.style.transform += " scaleX(1)";
			lastDirection = 1;
		} else {
			sprite.style.transform += ` scaleX(${lastDirection})`;
		}

		setTimeout(() => {
			sprite.style.transition = "";
			sprite.style.background = "url('gridGame/idle.gif') no-repeat center center";
			sprite.style.backgroundSize = "cover";
			callback();
		}, 100);
	}
};

const animatePlayerHit = (blockMoved, callback, direction) => {
	const sprite = document.querySelector(".player .sprite");
	if (sprite) {
		// Adjust sprite scale based on direction hit
		if (direction > 0) {
			sprite.style.transform = "scaleX(-1)";
			lastDirection = -1;
		} else if (direction < 0) {
			sprite.style.transform = "scaleX(1)";
			lastDirection = 1;
		}

		// Replace the sprite with a gif, ensuring the gif is restarted
		sprite.style.background = `url('gridGame/hit.gif?${new Date().getTime()}') no-repeat center center`;
		sprite.style.backgroundSize = "cover";

		let audio;
		if (blockMoved) {
			audio = new Audio("/gridGame/hit.wav");
		}
		else {
			audio = new Audio("/gridGame/bump.wav");
		}
		audio.play();

		setTimeout(() => {
			sprite.style.background = "url('gridGame/idle.gif') no-repeat center center";
			sprite.style.backgroundSize = "cover";
			callback();
		}, 120);
	}
};

// Update game grid
const updateGame = () => {
	// Register and render each cell type
	document.querySelectorAll(".cell").forEach((cell, i) => {
		const x = i % gridSize;
		const y = Math.floor(i / gridSize);
		cell.innerHTML = "";
		cell.className = "cell";

		if (x === playerPosition.x && y === playerPosition.y) {
			cell.classList.add("player");
			const spriteDiv = document.createElement("div");
			spriteDiv.classList.add("sprite");
			if (direction < 0) {
				spriteDiv.style.transform = 'scaleX(1)';
			} else if (direction > 0) {
				spriteDiv.style.transform = 'scaleX(-1)';
			}
			else {
				spriteDiv.style.transform = `scaleX(${lastDirection})`;
			}
			cell.appendChild(spriteDiv);
		} else {
			const block = blocks.find((block) => block.x === x && block.y === y);
			const solution = solutions.find(
				(solution) => solution.x === x && solution.y === y
			);
			if (block && solution) {
				cell.classList.add("solution");
				cell.style.backgroundColor = block.color;
				cell.style.boxShadow = `inset 0 0 10px ${solution.color}, 0 0 10px ${solution.color}`;
			} else if (block) {
				cell.classList.add("block");
				cell.style.backgroundColor = block.color;
				cell.style.boxShadow = `inset 0 0 10px ${block.color}, 0 0 10px ${block.color}`;
			} else if (solution) {
				cell.classList.add("solution");
				cell.style.backgroundColor = "rgb(24, 24, 24)";
				cell.style.boxShadow = `inset 0 0 20px ${solution.color}, 0 0 20px ${solution.color}`;
			} else if (walls.has(`${x},${y}`)) {
				cell.classList.add("wall");
			} else {
				cell.style.backgroundColor = "rgb(24, 24, 24)";
				cell.style.boxShadow = "none";
			}
		}
	});
	checkVictory();
};

const checkVictory = () => {
	const allSolved = blocks.every(
		(block, index) =>
			block.x === solutions[index].x && block.y === solutions[index].y
	);
	if (allSolved && blocks.length > 0 && solutions.length > 0) {
		showVictoryPopup();
	}
};


// Controls
let pressUp = false, pressDown = false, pressLeft = false, pressRight = false;
document.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'ArrowUp': if (!pressUp) { movePlayer(0, -1); pressUp = true; } break;
		case 'ArrowDown': if (!pressDown) { movePlayer(0, 1); pressDown = true; } break;
		case 'ArrowLeft': if (!pressLeft) { movePlayer(-1, 0); pressLeft = true; } break;
		case 'ArrowRight': if (!pressRight) { movePlayer(1, 0); pressRight = true; } break;
	}
});
document.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'ArrowUp': pressUp = false; break;
		case 'ArrowDown': pressDown = false; break;
		case 'ArrowLeft': pressLeft = false; break;
		case 'ArrowRight': pressRight = false; break;
	}
});
document.querySelectorAll(".control-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		const id = btn.id;
		switch (id) {
			case "up": movePlayer(0, -1); break;
			case "down": movePlayer(0, 1); break;
			case "left": movePlayer(-1, 0); break;
			case "right": movePlayer(1, 0); break;
		}
	});
});

const showVictoryPopup = () => {
	const popup = document.getElementById("popup");
	popup.style.display = "block";
	isMoving = true;
};

const nextLevel = () => {
	level += 1;
	setupGame();
	const popup = document.getElementById("popup");
	popup.style.display = "none";
};
// Restart current level

// Listen for the Main Menu button
document.getElementById("mainMenuButton").addEventListener("click", () => {
	window.location.href = "index.html";
});

document.addEventListener("keydown", (e) => {
	if (e.key === "r" || e.key === "R") {
		setupGame(); // Resets the current level
	}
});