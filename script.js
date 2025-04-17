let players = [];
let scores = [];
let currentPlayerIndex = 0;
let turnScore = 0;
let diceMode = 1;
let previousDoubles = 0;
let hasRolled = false;

const playerCountInput = document.getElementById("player-count");
const nameInputsDiv = document.getElementById("name-inputs");
const startBtn = document.getElementById("start-btn");
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const scoreboard = document.getElementById("scoreboard");
const currentPlayerNameEl = document.getElementById("current-player-name");
const diceResultEl = document.getElementById("dice-result");
const turnScoreEl = document.getElementById("turn-score");
const winnerEl = document.getElementById("winner");
const backBtn = document.getElementById("back-btn");
const holdBtn = document.getElementById("hold-btn");

document.getElementById("roll-btn").addEventListener("click", rollDice);
holdBtn.addEventListener("click", holdTurn);
backBtn.addEventListener("click", backToSetup);
playerCountInput.addEventListener("change", updateNameInputs);
startBtn.addEventListener("click", startGame);

updateNameInputs();

function updateNameInputs() {
  const count = parseInt(playerCountInput.value);
  nameInputsDiv.innerHTML = "";
  for (let i = 0; i < count; i++) {
    nameInputsDiv.innerHTML += `
      <input type="text" placeholder="Pelaaja ${i + 1} nimi" id="name-${i}" required><br>
    `;
  }
}

function startGame() {
  const count = parseInt(playerCountInput.value);
  players = [];
  scores = [];
  for (let i = 0; i < count; i++) {
    const name = document.getElementById(`name-${i}`).value || `Pelaaja ${i + 1}`;
    players.push(name);
    scores.push(0);
  }

  const selectedMode = document.querySelector('input[name="dice-mode"]:checked').value;
  diceMode = parseInt(selectedMode);

  setupScreen.style.display = "none";
  gameScreen.style.display = "block";
  updateScoreboard();
  updateTurnInfo();
}

function updateScoreboard() {
  scoreboard.innerHTML = players.map((name, index) => {
    return `<p>${name}: ${scores[index]} pistettä</p>`;
  }).join("");
}

function updateTurnInfo() {
  currentPlayerNameEl.textContent = players[currentPlayerIndex];
  turnScoreEl.textContent = turnScore;
  diceResultEl.textContent = "-";
  hasRolled = false;
  holdBtn.style.display = "none"; // Piilota lopeta-nappi kunnes heitetään
}

function rollDice() {
  hasRolled = true;
  holdBtn.style.display = "inline-block"; // Näytä lopeta-nappi kun heitetty

  let dice1 = Math.floor(Math.random() * 6) + 1;
  let dice2 = diceMode === 2 ? Math.floor(Math.random() * 6) + 1 : null;

  if (diceMode === 1) {
    diceResultEl.textContent = dice1;

    if (dice1 === 1) {
      turnScore = 0;
      nextPlayer();
    } else {
      turnScore += dice1;
    }

  } else {
    diceResultEl.textContent = `${dice1} & ${dice2}`;

    if (dice1 === 1 && dice2 === 1) {
      turnScore += 25;
      previousDoubles = 0;
    } else if (dice1 === 1 || dice2 === 1) {
      turnScore = 0;
      previousDoubles = 0;
      nextPlayer();
      return;
    } else if (dice1 === dice2) {
      turnScore += (dice1 + dice2) * 2;
      previousDoubles++;
      if (previousDoubles === 3) {
        turnScore = 0;
        previousDoubles = 0;
        nextPlayer();
        return;
      }
    } else {
      turnScore += dice1 + dice2;
      previousDoubles = 0;
    }
  }

  turnScoreEl.textContent = turnScore;
}

function holdTurn() {
  if (!hasRolled) return; // Estä lopetus ilman heittoa

  scores[currentPlayerIndex] += turnScore;
  turnScore = 0;
  previousDoubles = 0;

  if (scores[currentPlayerIndex] >= 100) {
    winnerEl.textContent = `🎉 ${players[currentPlayerIndex]} voitti pelin!`;
    disableGame();
    return;
  }

  nextPlayer();
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateScoreboard();
  updateTurnInfo();
  showTurnNotification();
}

function disableGame() {
  document.getElementById("roll-btn").disabled = true;
  holdBtn.disabled = true;
}

function backToSetup() {
  setupScreen.style.display = "block";
  gameScreen.style.display = "none";
  players = [];
  scores = [];
  currentPlayerIndex = 0;
  turnScore = 0;
  previousDoubles = 0;
  hasRolled = false;
  winnerEl.textContent = "";
  document.getElementById("roll-btn").disabled = false;
  holdBtn.disabled = false;
  holdBtn.style.display = "inline-block";
}

function showTurnNotification() {
  const notification = document.getElementById("turn-notification");
  const message = document.getElementById("notification-message");

  message.textContent = `Vuoro siirtyi pelaajalle: ${players[currentPlayerIndex]}`;

  notification.style.display = "block";
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.style.display = "none";
    }, 300);
  }, 2000);
}
