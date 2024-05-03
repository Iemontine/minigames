"use strict";

let gridSize = 11;
let playerPosition;
let blocks;
let solutions;
let walls;
let wallSprites;
let level = 1;
let isMoving = false;

let site_music;
let muted = false;
document.addEventListener("DOMContentLoaded", () => {
	// Generate the game grid
	const grid = document.getElementById("gameGrid");
	for (let i = 0; i < gridSize * gridSize; i++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		grid.appendChild(cell);
	}

	// Start playing site music
	site_music = new Audio('gridGame/devmusic.mp3');
	site_music.loop = true;
	const promise = site_music.play();

	// Start game
	setupGame();
});

// Used for resizing the game grid to account for larger puzzles
function setGridSize(dimensions, cellSize) {
	// Set grid size to 13x13 to allow for the larger puzzle and for the border walls
	if (window.innerWidth < 800) {
		cellSize = cellSize / 2;
	} else {
		cellSize = cellSize; // Set the default cellSize for desktop resolution
	}
	gridSize = dimensions;
	document.documentElement.style.setProperty('--dimension', dimensions.toString());
	document.documentElement.style.setProperty('--size', cellSize.toString() + 'px');
	const grid = document.getElementById("gameGrid");
	grid.innerHTML = '';
	for (let i = 0; i < dimensions * dimensions; i++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		grid.appendChild(cell);
	}
	const gameGrid = document.getElementById("gameGrid");
	gameGrid.style.gridTemplateRows = `repeat(${dimensions}, ${cellSize}px)`;
	gameGrid.style.gridTemplateColumns = `repeat(${dimensions}, ${cellSize}px)`;
}

/**
 * Generates the game grid, initializes game variables based on the current level setup.
 * This function is called when the DOM content is loaded.
 */
const setupGame = () => {
	function generateColor(i) {
		return ['#FF0000', '#00FF00', '#0000FF',
			'#FFFF00', '#FF00FF', '#00FFFF',
			'#FF5000', '#FF0050', '#50FF00',
			'#00FF50', '#5000FF', '#0050FF',
			'#FF50FF'][i];
	}
	function generateBorder(size) {
		walls = new Set();
		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				if (row < 1 || row > size - 2 || col < 1 || col > size - 2) {
					walls.add(`${row},${col}`);
				}
			}
		}
		return walls;
	}
	function fillBorder(size) {
		let spriteMap = new Map();
		spriteMap.set('0,0', 'left1');
		spriteMap.set(`${size},0`, 'right');
		spriteMap.set(`0,${size}`, 'left1');
		spriteMap.set(`${size},${size}`, 'right');

		for (let i = 1; i < size; i++)
			spriteMap.set(`${i},0`, `mid${Math.floor(Math.random() * 6 + 1)}`);
		for (let i = 1; i < size; i++)
			spriteMap.set(`0,${i}`, 'top');
		for (let i = 1; i < size; i++)
			spriteMap.set(`${size},${i}`, 'top');
		for (let i = 1; i < size; i++)
			spriteMap.set(`${i},${size}`, `mid${Math.floor(Math.random() * 6 + 1)}`);

		return spriteMap;
	}
	function fillWalls(size) {
		let spriteMap = new Map();
		spriteMap.set('0,0', 'wall_top_left_corner');
		spriteMap.set(`0,${size}`, 'wall_bottom_left_corner');
		spriteMap.set(`${size},${size}`, 'wall_bottom_right_corner');
		spriteMap.set(`${size},0`, 'wall_top_right_corner');
		
		for (let i = 1; i < size; i++)
			spriteMap.set(`${i},0`, `mid${Math.floor(Math.random() * 6 + 1)}`);
		for (let i = 1; i < size; i++)
			spriteMap.set(`0,${i}`, 'wall_left');
		for (let i = 1; i < size; i++)
			spriteMap.set(`${size},${i}`, 'wall_right');
		for (let i = 1; i < size; i++)
			spriteMap.set(`${i},${size}`, 'wall_bottom');

		return spriteMap;
	}

	if (level === 1) {
		// Set the wall positions
		walls = generateBorder(11);
		walls = new Set([...walls, '2,6', '8,6']);

		// Set the wall sprites
		wallSprites = fillBorder(10);
		wallSprites.set('2,6', 'fill');
		wallSprites.set('8,6', 'fill');

		// Set the block and solution positions
		blocks = [
			{ x: 5, y: 6, color: generateColor(0) },
			{ x: 3, y: 3, color: generateColor(2) },
		];
		solutions = [
			{ x: 5, y: 4 },
			{ x: 7, y: 3 },
		];
		playerPosition = { x: 5, y: 8 };
	}
	else if (level === 2) {
		// Set the wall positions
		walls = generateBorder(11);
		walls = new Set([...walls, '4,8', '2,9']);

		// Generate the wall sprites
		wallSprites = fillWalls(10);
		wallSprites.set('4,8', 'full');
		wallSprites.set('2,9', 'full');

		// Set the block and solution positions
		blocks = [
			{ x: 7, y: 3, color: generateColor(0) },
			{ x: 7, y: 6, color: generateColor(3) },
			{ x: 2, y: 2, color: generateColor(5) },
		];
		solutions = [
			{ x: 3, y: 5 },
			{ x: 9, y: 9 },
			{ x: 3, y: 7 },
		];
		playerPosition = { x: 1, y: 1 };
	}
	else if (level === 3) {
		// Set the wall positions
		walls = generateBorder(11);

		// Generate the wall sprites
		wallSprites = fillBorder(10);

		// Set the block and solution positions
		blocks = [
			{ x: 3, y: 3, color: generateColor(0) },
			{ x: 3, y: 7, color: generateColor(2) },
			{ x: 7, y: 3, color: generateColor(3) },
			{ x: 7, y: 7, color: generateColor(1) },
			{ x: 5, y: 7, color: generateColor(4) },
		];
		solutions = [
			{ x: 2, y: 6 },
			{ x: 4, y: 7 },
			{ x: 8, y: 6 },
			{ x: 6, y: 7 },
			{ x: 5, y: 5 },
		];
		playerPosition = { x: 1, y: 1 };
	}
	else if (level === 4) {
		setGridSize(13, 57); // Resize the grid to 13x13

		// Set the wall positions
		walls = generateBorder(13);
		// Append to the border walls
		walls = new Set([...walls, '9,1', '10,1', '10,5', '2,5', '5,5', '7,5', '6,6', '6,7']);

		// Generate the wall sprites
		wallSprites = fillWalls(12);
		wallSprites.set('9,1', 'full');
		wallSprites.set('10,1', 'full');
		wallSprites.set('10,5', 'full');
		wallSprites.set('2,5', 'full');

		// Set the block and solution positions
		blocks = [
			{ x: 4, y: 2, color: generateColor(0) },
			{ x: 8, y: 2, color: generateColor(2) },
			{ x: 9, y: 2, color: generateColor(3) },
			{ x: 10, y: 3, color: generateColor(4) },
			{ x: 9, y: 4, color: generateColor(5) },
			{ x: 10, y: 8, color: generateColor(6) },
			{ x: 10, y: 10, color: generateColor(7) },
			{ x: 9, y: 10, color: generateColor(8) },
			{ x: 6, y: 10, color: generateColor(9) },
			{ x: 5, y: 10, color: generateColor(10) },
			{ x: 2, y: 10, color: generateColor(11) },
			{ x: 2, y: 8, color: generateColor(12) },
		];
		solutions = [
			{ x: 4, y: 5 },
			{ x: 8, y: 5 },
			{ x: 5, y: 4 },
			{ x: 6, y: 5 },
			{ x: 7, y: 4 },
			{ x: 7, y: 6 },
			{ x: 8, y: 6 },
			{ x: 7, y: 7 },
			{ x: 6, y: 8 },
			{ x: 5, y: 7 },
			{ x: 4, y: 6 },
			{ x: 5, y: 6 },
		];
		playerPosition = { x: 6, y: 9 };
	}
	else if (level === 5) {
		setGridSize(11, 60); // Resize the grid to 13x13
		// Set the wall positions
		walls = generateBorder(11);
		walls = new Set([...walls, '4,1', '5,1', '6,1', '7,1', '3,2', '4,2', '5,2', '6,2', '7,2', '8,2', '2,3', '3,3', '4,3', '5,3', '6,3', '7,3', '8,3', '3,4', '5,4']);

		// Set the wall sprites
		wallSprites = fillBorder(10);

		// Set the block and solution positions
		blocks = [
			{ x: 6, y: 5, color: generateColor(0) },
			{ x: 4, y: 6, color: generateColor(1) },
			{ x: 8, y: 7, color: generateColor(2) },
			{ x: 8, y: 8, color: generateColor(3) },
			{ x: 3, y: 8, color: generateColor(10) },
			{ x: 2, y: 7, color: generateColor(5) },
		];
		solutions = [
			{ x: 5, y: 7 },
			{ x: 7, y: 5 },
			{ x: 7, y: 6 },
			{ x: 5, y: 8 },
			{ x: 3, y: 6 },
			{ x: 3, y: 7 },
		];
		playerPosition = { x: 5, y: 9 };
	}

	// Assign colors to solutions based on corresponding blocks
	solutions.forEach((solution, index) => {
		solution.color = blocks[index].color;
	});
	updateGame(); 		// Update the game grid with the modified solutions
	isMoving = false; 	// Reenable movement between levels
};

// Functions for handling player and block movement
const inWall = (position) => {
	return blocks.some((block) => position.x === block.x && position.y === block.y);
};
const inSolution = (position) => {
	return solutions.some((solution) => position.x === solution.x && position.y === solution.y) && !blocks.some((block) => position.x === block.x && position.y === block.y);
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
	// Calculate the new position based on the player's movement
	const oldPlayerPosition = { x: playerPosition.x, y: playerPosition.y }
	const newPosition = { x: playerPosition.x + dx, y: playerPosition.y + dy };

	// Check if the new position is within the game grid bounds
	if (inBounds(newPosition)) {
		isMoving = true;

		// Calculate the size of each cell in the grid
		const cellSize = document.querySelector(".cell").offsetWidth;
		const translateX = dx * cellSize;
		const translateY = dy * cellSize;

		// Check for collision and if the player moves into a block
		let collision = false;
		blocks.forEach((block, index) => {
			// Check if the player is moving into any block
			if (newPosition.x === block.x && newPosition.y === block.y) {
				const oldBlockPositionX = block.x;
				const oldBlockPositionY = block.y;
				let blockMoved = false;
				let newBlockPosition = { x: block.x + dx, y: block.y + dy };
				while (inBounds(newBlockPosition) && !inWall(newBlockPosition) && !inSolution(newBlockPosition)
				) {
					newBlockPosition.x += dx;
					newBlockPosition.y += dy;
					blockMoved = true;
				}

				// Push the block until it hits the edge/wall or another block
				if (inSolution(newBlockPosition)) {
					blocks[index] = {
						x: newBlockPosition.x,
						y: newBlockPosition.y,
						color: blocks[index].color,
					};
					blockMoved = true;
				}
				else {
					blocks[index] = {
						x: newBlockPosition.x - dx,
						y: newBlockPosition.y - dy,
						color: blocks[index].color,
					};
				}

				if (blockMoved) {
					const oldBlockIndex = oldBlockPositionY * gridSize + oldBlockPositionX;
					const oldBlockCell = document.querySelectorAll(".cell")[oldBlockIndex];
					setTimeout(() => {
						oldBlockCell.style.backgroundImage = `url('gridGame/block_hit.gif?${new Date().getTime()} no-repeat center center')`;
						oldBlockCell.style.backgroundSize = "cover";
					}, 200);
					setTimeout(() => {
						oldBlockCell.style.backgroundImage = "";
					}, 400);
				}

				// Animate the player's hit and update the game after the animation
				animatePlayerHit(blockMoved, dx, () => {
					isMoving = false;
					updateGame();
				});
				collision = true;
			}
		});

		// If there was no collision, the player was able to move
		if (!collision) {
			playerPosition = newPosition;

			const oldPlayerIndex = oldPlayerPosition.y * gridSize + oldPlayerPosition.x;
			const cells = document.querySelectorAll(".cell");
			const oldPlayerCell = cells[oldPlayerIndex];
			setTimeout(() => {
				oldPlayerCell.style.backgroundImage = `url('gridGame/dash.gif?${new Date().getTime()}')`;
				oldPlayerCell.style.backgroundSize = "cover";
			}, 100);
			setTimeout(() => {
				oldPlayerCell.style.backgroundImage = "";
			}, 400);

			// Freeze movement to allow for movement animation to play
			animatePlayerMovement(translateX, translateY, () => {
				isMoving = false;
				updateGame();
			});
		}
	}
};

// Keep track of the player's movement direction
let direction;
let lastDirection = 1;
// Handle player movement + hit animations/effects
const animatePlayerMovement = (dx, dy, callback) => {
	direction = dx;
	const sprite = document.querySelector(".player .sprite");
	if (sprite) {
		const translation = `translate(${dx}px, ${dy}px)`;


		sprite.style.transition = "transform 100ms ease-in";
		sprite.style.transform = translation;
		sprite.style.background = `url('gridGame/move.png') no-repeat center center`;
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
const animatePlayerHit = (blockMoved, direction, callback) => {
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
			audio = new Audio("gridGame/hit.wav");
		}
		else {
			audio = new Audio("gridGame/bump.wav");
		}
		audio.play();

		setTimeout(() => {
			sprite.style.background = "url('gridGame/idle.gif') no-repeat center center";
			sprite.style.backgroundSize = "cover";
			callback();
		}, 200);
	}
};

// Updates the position of everything in the game grid
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
				spriteDiv.style.transform = 'scaleX(1)'; // Flip sprite horizontally if moving left
			} else if (direction > 0) {
				spriteDiv.style.transform = 'scaleX(-1)'; // Flip sprite horizontally if moving right
			}
			else {
				spriteDiv.style.transform = `scaleX(${lastDirection})`; // Maintain previous direction if not moving horizontally
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
				cell.style.backgroundColor = "rgb(12, 12, 12)";
				cell.style.boxShadow = `inset 0 0 20px ${solution.color}, 0 0 20px ${solution.color}`;
			} else if (walls.has(`${x},${y}`)) {
				cell.classList.add("wall");
				cell.style.backgroundColor = "rgb(0, 0, 0)";
				const wallType = wallSprites.get(`${x},${y}`);
				cell.style.backgroundSize = "contain";
				cell.style.backgroundImage = `url('gridGame/tiles/${wallType}.png')`;
			} else {
				cell.style.backgroundColor = "rgb(12, 12, 12)";
				cell.style.boxShadow = "none";
			}
		}
	});
	checkVictory(); // Check if the player has solved the level
};

const checkVictory = () => {
	const allSolved = blocks.every(
		(block, index) =>
			block.x === solutions[index].x && block.y === solutions[index].y
	);
	if (allSolved && blocks.length > 0 && solutions.length > 0) {
		isMoving = true;	// Lock movement until the player closes the popup

		// Pause a bit before showing the popup
		setTimeout(() => {
			// Display the level complete popup
			const popup = document.getElementById("popup");
			popup.style.display = "block";
			// Play the level complete sound
			let audio = new Audio('gridGame/level_complete.mp3');
			audio.play();
		}, 750);
	}
};
const nextLevel = () => {
	level += 1;

	const popup = document.getElementById("popup");
	popup.style.display = "none";

	document.querySelectorAll(".cell").forEach((cell, i) => {
		cell.style.backgroundImage = "";
	});
	// Reset the background image of each cell
	setupGame();
};
document.addEventListener('keydown', (e) => {
	if (e.key === ' ' && document.getElementById('popup').style.display === 'block') {
		nextLevel();
	}
});

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

// Access Controls
// Listen for the Next Level button
document.getElementById("popup").addEventListener("click", nextLevel);
// Listen for the Mute button
document.getElementById("muteButton").addEventListener("click", () => {
	console.log("hello");
	if (muted) {
		site_music.play();
		let musicButton = document.getElementById("muteButton");
		musicButton.style.background = "url('gridGame/jamming.png') no-repeat center center";
		musicButton.style.backgroundSize = "contain";
		musicButton.style.width = "45px";
		musicButton.style.height = "45px";
		muted = false;
	} else {
		site_music.pause();
		let musicButton = document.getElementById("muteButton");
		musicButton.style.background = "url('gridGame/snoozing.png') no-repeat center center";
		musicButton.style.backgroundSize = "contain";
		musicButton.style.width = "45px";
		musicButton.style.height = "45px";
		muted = true;
	}
});
// Listen for the Main Menu button
document.getElementById("mainMenuButton").addEventListener("click", () => {
	window.location.href = "index.html";
});
// Listen for the Restart button
document.getElementById("restartButton").addEventListener("click", (e) => {
	if (!isMoving) {	// Ensure not in the 'win' state
		setupGame(); // Resets the current level
	}
});
document.addEventListener("keydown", (e) => {
	if (e.key === "r" || e.key === "R") {
		setupGame(); // Resets the current level
	}
});