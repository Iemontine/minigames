"use strict";

const grid = document.getElementById("gameGrid");
const gridSize = 12;
let playerPosition = {x: 0, y: 0};
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
const movePlayer = (dx, dy) => {
    let newPosition = {x: playerPosition.x + dx, y: playerPosition.y + dy};
    let newBlockPosition = {x: blockPosition.x + dx, y: blockPosition.y + dy};
    const newPositionKey = `${newPosition.x},${newPosition.y}`;
    if (newPosition.x >= 0 && newPosition.x < gridSize &&
        newPosition.y >= 0 && newPosition.y < gridSize &&
        !hiddenBlocks.has(newPositionKey)) {
        // Check if the player is moving into the block
        if(newPosition.x === blockPosition.x && newPosition.y === blockPosition.y) {
            // Push the block until it hits the edge or a hidden block
            while(newBlockPosition.x >= 0 && newBlockPosition.x < gridSize &&
                  newBlockPosition.y >= 0 && newBlockPosition.y < gridSize &&
                  !hiddenBlocks.has(`${newBlockPosition.x},${newBlockPosition.y}`)) {
                blockPosition = newBlockPosition; // Update block position
                newBlockPosition.x += dx;
                newBlockPosition.y += dy;
            }
            // Correct block position to be the last acceptable position
            if(!(newBlockPosition.x >= 0 && newBlockPosition.x < gridSize && 
                 newBlockPosition.y >= 0 && newBlockPosition.y < gridSize) ||
                hiddenBlocks.has(`${newBlockPosition.x},${newBlockPosition.y}`)) {
                blockPosition = {x: newBlockPosition.x - dx, y: newBlockPosition.y - dy};
            }
        } else { // If not moving into block, update player position
            playerPosition = newPosition;
        }
        updateGame();
    }
};

// Update game grid
const updateGame = () => {
	// Render each cell type
	document.querySelectorAll('.cell').forEach((cell, i) => {
		const x = i % gridSize;
		const y = Math.floor(i / gridSize);
		cell.className = 'cell'; // Reset cell class
		if (x === playerPosition.x && y === playerPosition.y) cell.classList.add('player');
		if (x === blockPosition.x && y === blockPosition.y) cell.classList.add('block');
		if(hiddenBlocks.has(`${x},${y}`)) cell.classList.add('hidden');
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