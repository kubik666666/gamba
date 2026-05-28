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
    result.textContent = '⚠️ Nejprve zvolte Orla nebo Pannu!';
    result.className = '';
    return;
  }

  const betAmount = parseInt(document.getElementById('cf-bet').value);
  if (isNaN(betAmount) || betAmount < 10) {
    result.textContent = '⚠️ Minimální sázka je 10 mincí.';
    result.className = '';
    return;
  }
  if (betAmount > coins) {
    result.textContent = '⚠️ Nemáte dostatek mincí!';
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

    const sideName = landedSide === 'heads' ? 'OREL' : 'PANNA';

    if (selectedSide === landedSide) {
      const winnings = betAmount * 2;
      coins += winnings;
      result.textContent = `🎉 Padl ${sideName}! Vyhráváš ${winnings} mincí!`;
      result.className = 'win';
    } else {
      result.textContent = `😢 Padl ${sideName}. Ztrácíš ${betAmount} mincí.`;
      result.className = 'lose';
    }

    saveCoins();
    updateCoinsDisplay();
    btn.disabled = false;
  }, 1500);
}
