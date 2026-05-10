const grid = document.getElementById('grid');
const timeDisplay = document.getElementById('time');
const nextDisplay = document.getElementById('nextNumber');
const triesDisplay = document.getElementById('tries');
const restartBtn = document.getElementById('restartBtn');
const message = document.getElementById('message');
const adText = document.getElementById('adText');

let nextNumber = 1;
let tries = 0;
let startTime = null;
let timerInterval = null;
let gameWon = false;
const adMessages = [
  'Play more puzzle games and beat your best time!',
  'Sponsored: Unlock a new challenge every day.',
  'Ad: Check out our free mobile brain teasers.',
  'Try the next level: timing mode unlocked!',
];
let adIndex = 0;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function updateTimer() {
  if (!startTime) return;
  const elapsed = Date.now() - startTime;
  timeDisplay.textContent = formatTime(elapsed);
}

function setMessage(text) {
  message.textContent = text;
}

function createGrid() {
  grid.innerHTML = '';
  const cells = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  cells.forEach((value) => {
    const button = document.createElement('button');
    button.className = 'cell';
    button.type = 'button';
    button.textContent = value;
    button.dataset.value = value;
    button.addEventListener('click', () => handleCellClick(button));
    grid.appendChild(button);
  });
}

function handleCellClick(button) {
  if (gameWon || button.classList.contains('disabled')) {
    return;
  }

  const value = Number(button.dataset.value);
  tries += 1;
  triesDisplay.textContent = tries;

  if (value === nextNumber) {
    button.classList.add('disabled');
    button.style.background = 'linear-gradient(180deg, #22d4b5dd, #0d8a72)';
    nextNumber += 1;
    nextDisplay.textContent = nextNumber <= 9 ? nextNumber : 'Done';
    setMessage('Great! Keep going.');

    if (nextNumber > 9) {
      finishGame();
    }
  } else {
    setMessage(`Oops! Tap ${nextNumber} next.`);
  }
}

function finishGame() {
  gameWon = true;
  clearInterval(timerInterval);
  setMessage(`You unlocked it! Finished in ${timeDisplay.textContent} with ${tries} taps.`);
}

function restartGame() {
  nextNumber = 1;
  tries = 0;
  startTime = Date.now();
  gameWon = false;
  timeDisplay.textContent = '00:00';
  nextDisplay.textContent = '1';
  triesDisplay.textContent = '0';
  setMessage('Tap 1 to begin.');
  createGrid();

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function rotateAd() {
  adText.textContent = adMessages[adIndex];
  adIndex = (adIndex + 1) % adMessages.length;
}

restartBtn.addEventListener('click', restartGame);

window.addEventListener('DOMContentLoaded', () => {
  restartGame();
  rotateAd();
  setInterval(rotateAd, 4000);
});
