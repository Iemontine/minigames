"use strict";

let grid = document.getElementById("gameGrid");
let gridSize = 11;
let playerPosition = { x: 1, y: 1 };
let blocks = [{ x: 3, y: 4 }, { x: 5, y: 5 }];
let solutions = [{ x: 3, y: 5 }, { x: 5, y: 6 }];
let walls = new Set(['0,1', '0,0', '2,1', '3,1', '4,1', '8,4', '5,1', '6,1', '7,1', '8,1', '9,1', '11,1', '11,0']);

const setupGame = () => {
	for (let i = 0; i < gridSize * gridSize; i++) {
		let cell = document.createElement('div');
		cell.classList.add('cell');
		grid.appendChild(cell);
	}
	updateGame();
};

// Handle player movement
const isInblock = (position) => {
	return blocks.some((block) => position.x === block.x && position.y === block.y);
}
const isInbounds = (position) => {
	return position.x >= 0
		&& position.x < gridSize
		&& position.y >= 0
		&& position.y < gridSize
		&& !walls.has(`${position.x},${position.y}`);
};
let isMoving = false;
const movePlayer = (dx, dy) => {
	if (isMoving) return;
	let newPosition = { x: playerPosition.x + dx, y: playerPosition.y + dy };

	if (isInbounds(newPosition)) {
		isMoving = true;

		let cellSize = document.querySelector('.cell').offsetWidth;
		let translateX = dx * cellSize;
		let translateY = dy * cellSize;

		// Check collision and if player moves into a block
		let collision = false;
		blocks.forEach((block, index) => {
			// Check if the player is moving into any block
			if (newPosition.x === block.x && newPosition.y === block.y) {
				let blockMoved = false;
				let newBlockPosition = { x: block.x + dx, y: block.y + dy };

				// Push the block until it hits the edge/wall, or another block
				while (isInbounds(newBlockPosition) && !isInblock(newBlockPosition)) {
					blockMoved = true;
					block = newBlockPosition; // Update block position
					newBlockPosition.x += dx;
					newBlockPosition.y += dy;
				}
				blocks[index] = { x: newBlockPosition.x - dx, y: newBlockPosition.y - dy }
				
				// Freeze movement to allow for hitting animation to play
				animatePlayerHit(blockMoved, () => {
					isMoving = false;
					updateGame();
				});
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
const animatePlayerMovement = (dx, dy, callback) => {
	let sprite = document.querySelector('.player .sprite');
	if (sprite) {
		let translation = `translate(${dx}px, ${dy}px)`;

		sprite.style.transition = 'transform 100ms linear';
		sprite.style.transform = translation;
		// Replace the sprite with a gif, ensuring the gif is restarted
		sprite.style.background = `url('gridGame/move.gif?${new Date().getTime()}') no-repeat center center`;
		sprite.style.backgroundSize = 'cover';

		setTimeout(() => {
			sprite.style.transition = '';
			sprite.style.transform = '';
			sprite.style.background = "url('gridGame/idle.png') no-repeat center center";
			sprite.style.backgroundSize = 'cover';
			callback();
		}, 100);
	}
};
const animatePlayerHit = (blockMoved, callback) => {
	let sprite = document.querySelector('.player .sprite');
	if (sprite) {
		// Replace the sprite with a gif, ensuring the gif is restarted
		sprite.style.background = `url(gridGame/hit.gif?${new Date().getTime()})`;
		sprite.style.backgroundSize = 'cover';

		let audio;
		if (blockMoved) {
			audio = new Audio('/gridGame/hit.wav');
		}
		else {
			audio = new Audio('/gridGame/bump.wav');
		}
		audio.play();

		setTimeout(() => {
			sprite.style.background = 'url(gridGame/idle.png)';
			sprite.style.backgroundSize = 'cover';
			callback();
		}, 100);
	}
};

// Update game grid
const updateGame = () => {
	// Register and render each cell type
	document.querySelectorAll('.cell').forEach((cell, i) => {
		let x = i % gridSize;
		let y = Math.floor(i / gridSize);
		cell.innerHTML = ''; 		// Clear previous content
		cell.className = 'cell'; 	// Reset cell class
		if (x === playerPosition.x && y === playerPosition.y) {
			cell.classList.add('player');
			let spriteDiv = document.createElement('div');
			spriteDiv.classList.add('sprite');
			cell.appendChild(spriteDiv); // Append sprite div into the cell
		} else if (blocks.some(blockPos => blockPos.x === x && blockPos.y === y)) {
			cell.classList.add('block');
		} else if (solutions.some(solutionPos => solutionPos.x === x && solutionPos.y === y)) {
			cell.classList.add('solution');
		} else if (walls.has(`${x},${y}`)) {
			cell.classList.add('wall');
		}
		checkVictory();
	});
};
const checkVictory = () => {
	const allSolved = blocks.every((block, index) => {
		return block.x === solutions[index].x && block.y === solutions[index].y;
	});
	if (allSolved) {
		console.log('All blocks are in their solution cells.');
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
document.querySelectorAll('.control-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		let id = btn.id;
		switch (id) {
			case 'up': movePlayer(0, -1); break;
			case 'down': movePlayer(0, 1); break;
			case 'left': movePlayer(-1, 0); break;
			case 'right': movePlayer(1, 0); break;
		}
	});
});

// Start game
setupGame();