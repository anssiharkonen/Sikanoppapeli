let currentPlayer = 1;
let scores = [0, 0];
let turnScore = 0;

const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const currentPlayerEl = document.getElementById('current-player');
const diceResultEl = document.getElementById('dice-result');
const turnScoreEl = document.getElementById('turn-score');
const winnerEl = document.getElementById('winner');

document.getElementById('roll-btn').addEventListener('click', () => {
  const dice = Math.floor(Math.random() * 6) + 1;
  diceResultEl.textContent = dice;

  if (dice === 1) {
    turnScore = 0;
    turnScoreEl.textContent = turnScore;
    nextPlayer();
  } else {
    turnScore += dice;
    turnScoreEl.textContent = turnScore;
  }
});

document.getElementById('hold-btn').addEventListener('click', () => {
  scores[currentPlayer - 1] += turnScore;
  turnScore = 0;
  updateScores();

  if (scores[currentPlayer - 1] >= 100) {
    winnerEl.textContent = `🎉 Pelaaja ${currentPlayer} voitti pelin!`;
    disableButtons();
  } else {
    nextPlayer();
  }
});

function nextPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  currentPlayerEl.textContent = `Pelaaja ${currentPlayer}`;
  turnScoreEl.textContent = 0;
  diceResultEl.textContent = '-';
}

function updateScores() {
  score1El.textContent = scores[0];
  score2El.textContent = scores[1];
}

function disableButtons() {
  document.getElementById('roll-btn').disabled = true;
  document.getElementById('hold-btn').disabled = true;
}
