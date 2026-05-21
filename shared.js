let coins = parseInt(localStorage.getItem('gambCoins') || '1000');

function saveCoins() {
  localStorage.setItem('gambCoins', coins);
}

function updateCoinsDisplay() {
  const el = document.getElementById('coins');
  if (el) el.textContent = coins;
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
    error.textContent = '⚠️ Enter a number between 100 and 5000.';
    return;
  }
  coins += amount;
  saveCoins();
  updateCoinsDisplay();
  closeDeposit();
}

document.addEventListener('DOMContentLoaded', updateCoinsDisplay);
