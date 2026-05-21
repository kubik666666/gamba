const casesData = [
  { name: 'Bronze', cost: 100, rewards: [10, 50, 150, 500], colors: ['gray', 'rgb(76, 175, 80)', 'rgb(33, 150, 243)', 'yellow'] },
  { name: 'Silver', cost: 250, rewards: [50, 150, 400, 1000], colors: ['gray', 'rgb(76, 175, 80)', 'rgb(33, 150, 243)', 'yellow'] },
  { name: 'Gold', cost: 500, rewards: [100, 300, 800, 2500], colors: ['gray', 'rgb(76, 175, 80)', 'rgb(33, 150, 243)', 'yellow'] }
];

let currentCase = 0;
let isOpening = false;

function selectCase(index) {
  if (isOpening) return;
  currentCase = index;
  document.querySelectorAll('.case-select button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  document.getElementById('open-btn').textContent = `OPEN CASE (${casesData[index].cost} coins)`;
  document.getElementById('case-result').textContent = '';
}

function generateRandomItem() {
  const c = casesData[currentCase];
  const r = Math.random();
  let idx = 0;
  if (r > 0.5) idx = 1;
  if (r > 0.8) idx = 2;
  if (r > 0.95) idx = 3;
  return { val: c.rewards[idx], col: c.colors[idx] };
}

function openCase() {
  if (isOpening) return;
  const c = casesData[currentCase];

  if (coins < c.cost) {
    const res = document.getElementById('case-result');
    res.textContent = '⚠️ Not enough coins!';
    res.className = 'lose';
    return;
  }

  coins -= c.cost;
  saveCoins();
  updateCoinsDisplay();

  isOpening = true;
  const btn = document.getElementById('open-btn');
  btn.disabled = true;
  
  const res = document.getElementById('case-result');
  res.textContent = '';
  res.className = '';

  const strip = document.getElementById('case-strip');
  strip.innerHTML = '';
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0)';

  const NUM_ITEMS = 60;
  const WIN_INDEX = 50;
  let winningItem = null;

  for (let i = 0; i < NUM_ITEMS; i++) {
    const item = generateRandomItem();
    if (i === WIN_INDEX) winningItem = item;
    
    const div = document.createElement('div');
    div.className = 'case-item';
    div.style.borderColor = item.col;
    div.innerHTML = `<div style="font-size: 2rem; margin-bottom: 5px;">💰</div><div style="color:${item.col}">${item.val}</div>`;
    strip.appendChild(div);
  }

  void strip.offsetWidth;

  const itemWidth = 110;
  const randomOffset = Math.floor(Math.random() * (itemWidth - 20)) - ((itemWidth - 20) / 2);
  const targetX = -(WIN_INDEX * itemWidth) + 165 - (itemWidth / 2) + randomOffset;

  strip.style.transition = 'transform 4s cubic-bezier(0.1, 0, 0, 1)';
  strip.style.transform = `translateX(${targetX}px)`;

  setTimeout(() => {
    isOpening = false;
    btn.disabled = false;
    
    coins += winningItem.val;
    saveCoins();
    updateCoinsDisplay();

    if (winningItem.val >= c.cost) {
      res.textContent = `🎉 You got ${winningItem.val} coins! PROFIT!`;
      res.className = 'win';
    } else {
      res.textContent = `😢 You got ${winningItem.val} coins.`;
      res.className = 'lose';
    }
  }, 4100);
}

document.addEventListener('DOMContentLoaded', () => {
  selectCase(0);
});
