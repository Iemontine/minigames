"use strict";

document.addEventListener('DOMContentLoaded', function () {
	const startButton = document.getElementById('startButton');
	const moles = document.querySelectorAll('.mole');
	const scoreDisplay = document.getElementById('score');
	const timeLeftDisplay = document.getElementById('timeLeft');
	let lastMole;       // ensures the same mole isn't selected twice
	let gameTimer;
	let score = 0;
	let timeLeft = 30;
	let speed = 1000;

	function resetGame() {
		score = 0;
		timeLeft = 30;
		speed = 1000;
		scoreDisplay.textContent = score;
		timeLeftDisplay.textContent = timeLeft;
	}

	function randomTime(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}

	function randomMole(moles) {
		const idx = Math.floor(Math.random() * (moles.length + 1));
		const mole = moles[idx];
		if (mole === lastMole) {
			return randomMole(moles);
		}
		lastMole = mole;
		return mole;
	}

	// TODO: fix timing
	function peep() {
		const time = randomTime(600, 600);
		// good feeling-lower bound is around 600, 600
		const mole = randomMole(moles);
		if (mole) {
			mole.src = 'image2.png';        // Mole ready to be whacked
			mole.dataset.hit = 'true';      // Mark as hit target
			setTimeout(() => {
				mole.src = 'image1.png'; // Mole goes back
				delete mole.dataset.hit; // Reset hit target
			}, time);
		}
	}

	function startGame() {
		resetGame(); // Reset score and timer
		startButton.style.display = 'none';
		gameTimer = setInterval(peep, 600);

		let countdownTimer = setInterval(() => {
			timeLeft--;
			speed -= 0;
			timeLeftDisplay.textContent = timeLeft;
			if (timeLeft <= 0) {
				clearInterval(gameTimer);
				clearInterval(countdownTimer);
				alert(`${score}`);
				startButton.style.display = 'block';
			}
		}, 1000);
	}

	moles.forEach(mole => {
		mole.addEventListener('click', () => {
			if (mole.dataset.hit) {
				score += 100;
				mole.src = 'image1.png'; // Change back immediately on hit
				delete mole.dataset.hit;
			} else {
				score -= 50;
			}
			scoreDisplay.textContent = score;
		});
	});

	startButton.addEventListener('click', startGame);
});