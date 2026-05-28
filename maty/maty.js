const machines = [
  ['🍒', '🍋', '🍉', '🍇', '⭐', '💎'],
  ['🐶', '🐱', '🐸', '🦊', '🐵', '🐼'],
  ['🔥', '💀', '👑', '💰', '🎲', '🃏']
];

let currentMachine = 0;
const SPIN_COST = 50;
let autoSpinActive = false;
let autoSpinTimeout = null;

function selectMachine(index) {
  if (autoSpinActive) {
    stopAutoSpin();
  }
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
  document.getElementById('spin-btn').disabled = coins < SPIN_COST || autoSpinActive;
  const autoBtn = document.getElementById('auto-btn');
  if (autoBtn) {
    autoBtn.disabled = coins < SPIN_COST && !autoSpinActive;
  }
}

function stopAutoSpin() {
  autoSpinActive = false;
  const autoBtn = document.getElementById('auto-btn');
  if (autoBtn) {
    autoBtn.textContent = 'AUTO (50)';
    autoBtn.classList.remove('active');
  }
  if (autoSpinTimeout) {
    clearTimeout(autoSpinTimeout);
    autoSpinTimeout = null;
  }
  refreshSpinBtn();
}

function toggleAutoSpin() {
  if (autoSpinActive) {
    stopAutoSpin();
  } else {
    if (coins < SPIN_COST) return;
    autoSpinActive = true;
    const autoBtn = document.getElementById('auto-btn');
    if (autoBtn) {
      autoBtn.textContent = 'STOP AUTO';
      autoBtn.classList.add('active');
    }
    document.getElementById('spin-btn').disabled = true;
    spin();
  }
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

  if (coins < SPIN_COST) {
    if (autoSpinActive) stopAutoSpin();
    return;
  }
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
      result.textContent = '🎉 JACKPOT! +' + (SPIN_COST * 5) + ' mincí!';
      result.className = 'win';
    } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
      coins += SPIN_COST * 2;
      result.textContent = '😏 Skvělé! +' + (SPIN_COST * 2) + ' mincí!';
      result.className = 'win';
    } else {
      result.textContent = '😢 Zkus to znovu! -' + SPIN_COST + ' mincí';
      result.className = 'lose';
    }

    saveCoins();
    updateCoinsDisplay();
    
    if (autoSpinActive) {
      if (coins >= SPIN_COST) {
        autoSpinTimeout = setTimeout(spin, 800);
      } else {
        stopAutoSpin();
      }
    } else {
      refreshSpinBtn();
    }
  }, 1500);
}

document.addEventListener('DOMContentLoaded', refreshSpinBtn);
