// each machine has its own set of emojis
const machines = [
  ['🍒', '🍋', '🍉', '🍇', '⭐', '💎'],
  ['🐶', '🐱', '🐸', '🦊', '🐵', '🐼'],
  ['🔥', '💀', '👑', '💰', '🎲', '🃏']
];

let currentMachine = 0;
let coins = 1000;
const SPIN_COST = 50;

function selectMachine(index) {
  currentMachine = index;
  // update active button
  document.querySelectorAll('.machine-select button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  // reset reels to first 3 emojis of chosen machine
  const emojis = machines[index];
  document.getElementById('r0').textContent = emojis[0];
  document.getElementById('r1').textContent = emojis[1];
  document.getElementById('r2').textContent = emojis[2];
  document.getElementById('result').textContent = '';
}

function updateCoins() {
  document.getElementById('coins').textContent = coins;
  document.getElementById('spin-btn').disabled = coins < SPIN_COST;
}

function openDeposit() {
  document.getElementById('deposit-input').value = '';
  document.getElementById('deposit-error').textContent = '';
  document.getElementById('deposit-modal').style.display = 'flex';
  document.getElementById('deposit-input').focus();
}

function closeDeposit() {
  document.getElementById('deposit-modal').style.display = 'none';
}

function confirmDeposit() {
  const amount = parseInt(document.getElementById('deposit-input').value);
  const error = document.getElementById('deposit-error');

  if (isNaN(amount) || amount < 100 || amount > 5000) {
    error.textContent = '⚠️ Please enter a number between 100 and 5000.';
    return;
  }

  coins += amount;
  updateCoins();
  closeDeposit();
}

function spin() {
  const btn = document.getElementById('spin-btn');
  const result = document.getElementById('result');
  const emojis = machines[currentMachine];
  const reels = [document.getElementById('r0'), document.getElementById('r1'), document.getElementById('r2')];

  if (coins < SPIN_COST) return;
  coins -= SPIN_COST;
  updateCoins();

  btn.disabled = true;
  result.textContent = '';
  result.className = '';

  // add spinning class
  reels.forEach(r => r.classList.add('spinning'));

  // rapidly swap emojis during spin
  const interval = setInterval(() => {
    reels.forEach(r => {
      r.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    });
  }, 80);

  // stop after 1.5s
  setTimeout(() => {
    clearInterval(interval);
    // pick final values
    const final = reels.map(r => {
      const pick = emojis[Math.floor(Math.random() * emojis.length)];
      r.textContent = pick;
      r.classList.remove('spinning');
      return pick;
    });

    // check win
    if (final[0] === final[1] && final[1] === final[2]) {
      coins += SPIN_COST * 5;
      result.textContent = '🎉 JACKPOT! +' + (SPIN_COST * 5) + ' coins! 🎉';
      result.className = 'win';
    } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
      coins += SPIN_COST * 2;
      result.textContent = '😏 Nice! +' + (SPIN_COST * 2) + ' coins!';
      result.className = 'win';
    } else {
      result.textContent = '😢 Try again! -' + SPIN_COST + ' coins';
      result.className = 'lose';
    }

    updateCoins();
    btn.disabled = coins < SPIN_COST;
  }, 1500);
}
