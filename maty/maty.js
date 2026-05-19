const machines = [
  ['🍒', '🍋', '🍉', '🍇', '⭐', '💎'],
  ['🐶', '🐱', '🐸', '🦊', '🐵', '🐼'],
  ['🔥', '💀', '👑', '💰', '🎲', '🃏']
];

let currentMachine = 0;
const SPIN_COST = 50;

function selectMachine(index) {
  currentMachine = index;
  document.querySelectorAll('.machine-select button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  const emojis = machines[index];
  document.getElementById('r0').textContent = emojis[0];
  document.getElementById('r1').textContent = emojis[1];
  document.getElementById('r2').textContent = emojis[2];
  document.getElementById('result').textContent = '';
}

function refreshSpinBtn() {
  document.getElementById('spin-btn').disabled = coins < SPIN_COST;
}

function spin() {
  const btn = document.getElementById('spin-btn');
  const result = document.getElementById('result');
  const emojis = machines[currentMachine];
  const reels = [
    document.getElementById('r0'),
    document.getElementById('r1'),
    document.getElementById('r2')
  ];

  if (coins < SPIN_COST) return;
  coins -= SPIN_COST;
  saveCoins();
  updateCoinsDisplay();

  btn.disabled = true;
  result.textContent = '';
  result.className = '';

  reels.forEach(r => r.classList.add('spinning'));

  const interval = setInterval(() => {
    reels.forEach(r => {
      r.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    });
  }, 80);

  setTimeout(() => {
    clearInterval(interval);
    const final = reels.map(r => {
      const pick = emojis[Math.floor(Math.random() * emojis.length)];
      r.textContent = pick;
      r.classList.remove('spinning');
      return pick;
    });

    if (final[0] === final[1] && final[1] === final[2]) {
      coins += SPIN_COST * 5;
      result.textContent = '🎉 JACKPOT! +' + (SPIN_COST * 5) + ' coins!';
      result.className = 'win';
    } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
      coins += SPIN_COST * 2;
      result.textContent = '😏 Nice! +' + (SPIN_COST * 2) + ' coins!';
      result.className = 'win';
    } else {
      result.textContent = '😢 Try again! -' + SPIN_COST + ' coins';
      result.className = 'lose';
    }

    saveCoins();
    updateCoinsDisplay();
    refreshSpinBtn();
  }, 1500);
}

document.addEventListener('DOMContentLoaded', refreshSpinBtn);
