"use strict";

const grid = document.getElementById("gameGrid");
const gridSize = 12;
let playerPosition = { x: 0, y: 0 };
let blockPosition = { x: 2, y: 3 };
let hiddenBlocks = new Set(['2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '8,1', '9,1']);

const setupGame = () => {
	for (let i = 0; i < gridSize * gridSize; i++) {
		const cell = document.createElement('div');
		cell.classList.add('cell');
		grid.appendChild(cell);
	}
	updateGame();
};

// Handle player movement
const isInbounds = (position) => {
	return position.x >= 0
		&& position.x < gridSize
		&& position.y >= 0
		&& position.y < gridSize
		&& !hiddenBlocks.has(`${position.x},${position.y}`);
}
let isMoving = false;
const movePlayer = (dx, dy) => {
	if (isMoving) return; // Prevent movement if an animation is in progress
	let newPosition = { x: playerPosition.x + dx, y: playerPosition.y + dy };
	let newBlockPosition = { x: blockPosition.x + dx, y: blockPosition.y + dy };

	if (isInbounds(newPosition)) {
		isMoving = true; // Block new moves

		const cellSize = document.querySelector('.cell').offsetWidth; // Assuming square cells
		const translateX = dx * cellSize;
		const translateY = dy * cellSize;

		// Check if the player is moving into the block
		if (newPosition.x === blockPosition.x && newPosition.y === blockPosition.y) {
			// Push the block until it hits the edge or a hidden block
			while (isInbounds(newBlockPosition)) {
				blockPosition = newBlockPosition; // Update block position
				newBlockPosition.x += dx;
				newBlockPosition.y += dy;
			}
			blockPosition = { x: newBlockPosition.x - dx, y: newBlockPosition.y - dy }
			updateGame();
			isMoving = false;
		}
		else { // If not moving into block, update player position
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
	const sprite = document.querySelector('.player .sprite');
	if (sprite) {
		const translation = `translate(${dx}px, ${dy}px)`;

		sprite.style.transition = 'transform 100ms linear';
		sprite.style.transform = translation;

		setTimeout(() => {
			sprite.style.transition = '';
			sprite.style.transform = '';
			callback();
		}, 100);
	}
};

// Update game grid
const updateGame = () => {
	// Register and render each cell type
	document.querySelectorAll('.cell').forEach((cell, i) => {
		const x = i % gridSize;
		const y = Math.floor(i / gridSize);
		cell.innerHTML = ''; 		// Clear previous content
		cell.className = 'cell'; 	// Reset cell class
		if (x === playerPosition.x && y === playerPosition.y) {
			cell.classList.add('player');
			let spriteDiv = document.createElement('div');
			spriteDiv.classList.add('sprite');
			cell.appendChild(spriteDiv); // Append sprite div into the cell
		}
		else if (x === blockPosition.x && y === blockPosition.y) cell.classList.add('block');
		else if (hiddenBlocks.has(`${x},${y}`)) cell.classList.add('hidden');
	});
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
		const id = btn.id;
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