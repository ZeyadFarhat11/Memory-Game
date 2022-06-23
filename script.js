const playBtn = document.getElementById("start"),
  nameEl = document.getElementById("name"),
  wins = document.getElementById("wins"),
  remaining = document.getElementById("remaining"),
  wrongTries = document.getElementById("wrong-tries"),
  cardsHolder = document.querySelector(".cards-holder"),
  cards = document.querySelectorAll(".card"),
  successSound = document.getElementById("success-sound"),
  failSound = document.getElementById("fail-sound"),
  clockSound = document.getElementById("clock-sound"),
  interval = null;

// Shuffle Cardss
(() => {
  let indexesArr = [...cards.keys()].sort(() => Math.random() - 0.5);

  cards.forEach((card, index) => {
    card.style.order = indexesArr[index];
  });
})();

// Update Wins Value
window.onload = function () {
  wins.textContent = localStorage.memoryGameWins || 0;
};

// Start Game
playBtn.addEventListener("click", function () {
  playBtn.remove();
  document.body.className = "";

  startGame();
  setTimer();
});

// Timer Function
function setTimer() {
  const time = 60;
  remaining.textContent = time;

  interval = setInterval(() => {
    remaining.textContent -= 1;
    if (remaining.textContent === "0") {
      clearInterval(int);

      // Play Fail Sound
      failSound.play();

      // Reload Page
      setTimeout(() => {
        document.location.reload();
      }, 2000);
    }
    // Play Clock Sound
    if (remaining.textContent === "5") {
      clockSound.play();
    }
  }, 1000);
}

// When Win Game
function gameWin() {
  clockSound.pause();
  successSound.play();
  // Increase And Update Win At LocalStorage
  let wins = localStorage.memoryGameWins || 0;
  wins = +wins + 1;
  localStorage.setItem("memoryGameWins", wins);

  // Reload Page
  setTimeout(() => {
    document.location.reload();
  }, 2000);

  // Stop Timer
  clearInterval(interval);
}

function startGame() {
  // Get Name
  const namePrompet = prompt("Enter Your Name...");
  nameEl.textContent = namePrompet || `Unknown`;

  // Appear Cards After Half Second
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.add("active");
    });

    // Hide Cards After 3 Seconds
    setTimeout(() => {
      cards.forEach((card) => {
        card.classList.remove("active");
      });
    }, 3000);
  }, 500);

  // On Click After Hide Cards
  setTimeout(() => {
    cards.forEach((card, index) => {
      card.addEventListener("click", function () {
        card.classList.add("active");

        // Cards Has Active Class
        let cardsActive = document.querySelectorAll(".card.active");

        if (cardsActive.length === 2) {
          cardsHolder.classList.add("disabled");

          if (cardsActive[0].dataset.id === cardsActive[1].dataset.id) {
            // Remove Active Class
            cardsActive[0].classList.remove("active");
            cardsActive[1].classList.remove("active");

            // Add Visible Class
            cardsActive[0].classList.add("visible-till-end");
            cardsActive[1].classList.add("visible-till-end");

            // Play Success Sound
            successSound.play();

            cardsHolder.classList.remove("disabled");
          } else {
            // Play Fail Sound
            failSound.play();

            // Increase Wrong Tries
            wrongTries.textContent = +wrongTries.textContent + 1;

            setTimeout(() => {
              // Remove Active Class
              cardsActive[0].classList.remove("active");
              cardsActive[1].classList.remove("active");

              cardsHolder.classList.remove("disabled");
            }, 1000);
          }
        }
        if (document.querySelectorAll(".card.visible-till-end").length === 16) {
          gameWin();
          failSound.remove();
        }
      });
    });
  }, 3500);
}
