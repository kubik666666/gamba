let selectedSide = null;

function selectSide(side) {
  selectedSide = side;
  document.querySelectorAll('.cf-option').forEach(btn => btn.classList.remove('active'));
  if (side === 'heads') {
    document.querySelectorAll('.cf-option')[0].classList.add('active');
  } else {
    document.querySelectorAll('.cf-option')[1].classList.add('active');
  }
}

function flipCoin() {
  const result = document.getElementById('cf-result');
  const btn = document.getElementById('flip-btn');
  const coin = document.getElementById('coin');

  if (!selectedSide) {
    result.textContent = '⚠️ Pick Heads or Tails first!';
    result.className = '';
    return;
  }

  const betAmount = parseInt(document.getElementById('cf-bet').value);
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

  coin.classList.add('flipping');

  setTimeout(() => {
    coin.classList.remove('flipping');

    const isHeads = Math.random() < 0.5;
    const landedSide = isHeads ? 'heads' : 'tails';

    coin.textContent = isHeads ? '🦅' : '🔢';

    if (selectedSide === landedSide) {
      const winnings = betAmount * 2;
      coins += winnings;
      result.textContent = `🎉 It's ${landedSide.toUpperCase()}! You won ${winnings} coins!`;
      result.className = 'win';
    } else {
      result.textContent = `😢 It's ${landedSide.toUpperCase()}. You lost ${betAmount} coins.`;
      result.className = 'lose';
    }

    saveCoins();
    updateCoinsDisplay();
    btn.disabled = false;
  }, 1500);
}
