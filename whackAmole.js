"use strict";


document.addEventListener('DOMContentLoaded', function () {
	const startButton = document.getElementById('startButton');
	const moles = document.querySelectorAll('.mole');
	const scoreDisplay = document.getElementById('score');
	const timeLeftDisplay = document.getElementById('timeLeft');
	

	let gameRunning = false;
	let gameTimer;
	let score = 0;
	let max_molesOut = 1;
	let timeLeft = 60;
	let peepRate = 1000;
	let peepLength = 1000;

	function resetGame() {
		score = 0;
		timeLeft = 60;
		max_molesOut = 1;
		gameRunning = true;
		scoreDisplay.textContent = score;
		timeLeftDisplay.textContent = timeLeft;
	}

	function randomTime(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}

	function randomMole(moles) {
		const idx = Math.floor(Math.random() * moles.length);
		const mole = moles[idx];
		if (mole.getAttribute("src") != "image1.png") {
			return randomMole(moles);
		}
		return mole;
	}

	function peep() {
		if (!gameRunning) return;

		let molesOut = Math.round(Math.random() * (max_molesOut - 1) + 1);

		for (let i = 0; i < molesOut; i++) {	// Random number of
			const mole = randomMole(moles);
			if (mole.getAttribute("src") == "image1.png") {
				mole.src = 'image2.png'; // Mole pops out
				mole.dataset.hit = true;
			}
			setTimeout(() => {
				mole.src = 'image1.png'; // Mole goes back
				delete mole.dataset.hit; // Reset hit target
			}, peepLength);
		}

		if (timeLeft < 50) {
			if (peepLength > 500) {
				peepLength -= 30;
			}
			if (peepRate > 500) {
				peepRate -= 10;
			}
			console.log(`${peepLength} ${peepRate}`);
		}
		// TODO: variable lengths depending on number of moles that are out?
		setTimeout(peep, molesOut > 0 ? peepLength + peepRate : peepRate);
	}

	function startGame() {
		resetGame();
		startButton.style.opacity = 0;
		startButton.style.transform = "scale(0)";

		gameTimer = setTimeout(peep, peepRate);

		let countdownTimer = setInterval(() => {
			timeLeft--;
			timeLeftDisplay.textContent = timeLeft;
			if (timeLeft == 45) {
				max_molesOut = 2;
			}
			else if (timeLeft == 20) {
				max_molesOut = 3;
			}
			if (timeLeft == 0) {
				clearInterval(countdownTimer);
				gameRunning = false;
				alert(`${score}`);
				startButton.style.display = 'block';
				startButton.style.opacity = 1;
				startButton.style.transform = "scale(1)";
			}
		}, 1000);
	}

	moles.forEach(mole => {
		mole.addEventListener('click', () => {
			if (!gameRunning) return;
			if (mole.dataset.hit) {
				score += 10;
				mole.src = 'image1.png'; // Change back immediately on hit
				delete mole.dataset.hit;
			} else {
				score -= 5;
			}
			scoreDisplay.textContent = score;
		});
	});

	startButton.addEventListener('click', startGame);
});