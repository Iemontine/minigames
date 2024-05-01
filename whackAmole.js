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
	let peepLength = 1500;

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
		if (mole.getAttribute("src") != "assets/mole.png") {
			return randomMole(moles);
		}
		return mole;
	}

	function peep() {
		if (!gameRunning) return;

		let molesOut = Math.round(Math.random() * (max_molesOut - 1) + 1);

		for (let i = 0; i < molesOut; i++) {	// Random number of
			const mole = randomMole(moles);
			if (mole.getAttribute("src") == "assets/mole.png") {
				mole.src = 'assets/mole.png'; // Mole pops out
				moveMoleUp(mole);
				console.log(mole.style);
				mole.dataset.hit = true;
			}
			setTimeout(() => {
				mole.src = 'assets/mole.png'; // Mole goes back
				moveMoleDown(mole);
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

	function moveMoleUp(mole) {
		let pos = -55;
		clearInterval(null);
		let id = setInterval(frame, 1);
		function frame() {
			if (pos === 0) {
						clearInterval(id);
					} else {
						pos++;
						mole.style.bottom = pos + "px";
					}
		}
	}

	function moveMoleDown(mole) {
		let pos = 0;
		clearInterval(null);
		let id = setInterval(frame, .5);
		function frame() {
			if (pos === -55) {
						clearInterval(id);
					} else {
						pos--;
						mole.style.bottom = pos + "px";

					}
		}
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
				mole.src = 'assets/mole.png'; // Change back immediately on hit
				lightRingGreen(mole);
				delete mole.dataset.hit;
			} else {
				score -= 5;
				lightRingRed(mole);
			}
			setTimeout(() => {
				resetLights(mole);
			}, 750);
			scoreDisplay.textContent = score;
		});
	});
	startButton.addEventListener('click', startGame);
});

function lightRingGreen(mole) {
	let moleHole = mole.closest(".mole-hole");
	let frontRing = moleHole.children[0];
	let backRing = moleHole.children[1];
	frontRing.classList.add("greenRing");
	backRing.classList.add("greenRing");
}

function lightRingRed(mole) {
	let moleHole = mole.closest(".mole-hole");
	let frontRing = moleHole.children[0];
	let backRing = moleHole.children[1];
	frontRing.classList.add("redRing");
	backRing.classList.add("redRing");
}

function resetLights(mole) {
		let moleHole = mole.closest(".mole-hole");
		let frontRing = moleHole.children[0];
		let backRing = moleHole.children[1];
		console.log(frontRing);
		frontRing.classList.remove("greenRing");
		backRing.classList.remove("greenRing");
		frontRing.classList.remove("redRing");
		backRing.classList.remove("redRing");
}