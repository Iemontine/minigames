document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const moles = document.querySelectorAll('.mole');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('timeLeft');
    let lastMole;
    let gameTimer;
    let speed = 1000;

    function resetGame() {
        score = 0;
        timeLeft = 60;
        speed = 1000;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
    }

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomMole(moles) {
        const idx = Math.floor(Math.random() * moles.length);
        const mole = moles[idx];
        if (mole === lastMole) {
            return randomMole(moles);
        }
        lastMole = mole;
        return mole;
    }

    function peep() {
        const time = randomTime(200, speed);
        const mole = randomMole(moles);
        mole.src = 'image2.png';        // Mole ready to be whacked
        mole.dataset.hit = 'true';      // Mark as hit target
        setTimeout(() => {
            mole.src = 'image1.png'; // Mole goes back
            delete mole.dataset.hit; // Reset hit target
            if (speed > 400) speed -= 20; // Increase speed gradually
        }, time);
    }

    function startGame() {
        resetGame(); // Reset score and timer
        startButton.style.display = 'none';
        gameTimer = setInterval(peep, 500);

        countdownTimer = setInterval(() => {
            timeLeft--;
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