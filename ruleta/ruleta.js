// Red numbers in standard roulette
const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

let selectedBet = null; // 'red' | 'black' | 'green'

function selectBet(type) {
  selectedBet = type;
  document.querySelectorAll('.bet-option').forEach(btn => btn.classList.remove('active'));
  const map = { red: 0, black: 1, green: 2 };
  document.querySelectorAll('.bet-option')[map[type]].classList.add('active');
}

function getColor(num) {
  if (num === 0) return 'green';
  return RED_NUMBERS.has(num) ? 'red' : 'black';
}

function spinRoulette() {
  const result = document.getElementById('roulette-result');
  const btn    = document.getElementById('spin-btn');
  const wheel  = document.getElementById('wheel');

  if (!selectedBet) {
    result.textContent = '⚠️ Pick a bet first!';
    result.className = '';
    return;
  }

  const betAmount = parseInt(document.getElementById('bet-amount').value);
  if (isNaN(betAmount) || betAmount < 10) {
    result.textContent = '⚠️ Minimum bet is 10 coins.';
    result.className = '';
    return;
  }
  if (betAmount > coins) {
    result.textContent = '⚠️ Not enough coins!';
    result.className = '';
    return;
  }

  coins -= betAmount;
  saveCoins();
  updateCoinsDisplay();
  btn.disabled = true;
  result.textContent = '';
  result.className = '';

  // Spin animation via CSS class
  wheel.classList.remove('spinning');
  // Force reflow to restart animation
  void wheel.offsetWidth;
  wheel.classList.add('spinning');

  setTimeout(() => {
    wheel.classList.remove('spinning');

    const landed = Math.floor(Math.random() * 37); // 0–36
    const color  = getColor(landed);

    const colorEmoji = { red: '🔴', black: '⚫', green: '🟢' };
    const colorLabel = { red: 'Red', black: 'Black', green: 'Green' };

    let won = false;
    let payout = 0;
    if (selectedBet === color) {
      won = true;
      if (color === 'green') {
        payout = betAmount * 35;
      } else {
        payout = betAmount * 2;
      }
    }

    if (won) {
      coins += payout;
      result.textContent = `${colorEmoji[color]} ${landed} – ${colorLabel[color]}! 🎉 +${payout} coins!`;
      result.className = 'win';
    } else {
      result.textContent = `${colorEmoji[color]} ${landed} – ${colorLabel[color]}. 😢 -${betAmount} coins`;
      result.className = 'lose';
    }

    saveCoins();
    updateCoinsDisplay();
    btn.disabled = false;
  }, 3100);
}
