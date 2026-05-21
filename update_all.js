const fs = require('fs');

const cssAdditions = `
/* ---- BLACKJACK ---- */
.bj-area {
  background: #0d0520;
  border-radius: 8px;
  padding: 15px;
  border: 2px solid #ffd700;
}

.bj-area h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.bj-hand {
  display: flex;
  gap: 10px;
  justify-content: center;
  min-height: 120px;
}

.bj-card {
  width: 80px;
  height: 110px;
  background: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
  border: 1px solid #ccc;
  position: relative;
}

.bj-card.red { color: #ff4444; }
.bj-card.black { color: #111; }
.bj-card.hidden { 
  background: repeating-linear-gradient(45deg, #0d0520, #0d0520 10px, #1a0a2e 10px, #1a0a2e 20px); 
  border-color: #ffd700; 
  color: transparent; 
}
`;

let cssContent = fs.readFileSync('style.css', 'utf8');
if (!cssContent.includes('.bj-area')) {
  fs.appendFileSync('style.css', cssAdditions);
}

const files = [
  'index.html',
  'maty/maty.html',
  'ruleta/ruleta.html',
  'coinflip/coinflip.html',
  'cases/cases.html'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the modal and old button with the new deposit link
  content = content.replace(/<button class="deposit-btn" onclick="openDeposit\(\)">💵 Deposit<\/button>\s*<!-- Deposit Modal -->\s*<div id="deposit-modal" class="modal-overlay".*?<\/div>\s*<\/div>\s*<\/div>/s, 
    file === 'index.html' 
    ? '<a href="deposit/deposit.html" class="deposit-btn" style="text-decoration:none;">💵 Deposit</a>'
    : '<a href="../deposit/deposit.html" class="deposit-btn" style="text-decoration:none;">💵 Deposit</a>'
  );

  // Add Blackjack to index.html grid if not present
  if (file === 'index.html' && !content.includes('Blackjack')) {
    content = content.replace(
      '  </div>\n\n  <script src="shared.js"></script>',
      `    <a href="blackjack/blackjack.html" class="game-link">\n      <span class="icon">🃏</span>\n      <span class="name">Blackjack</span>\n    </a>\n  </div>\n\n  <script src="shared.js"></script>`
    );
  }

  fs.writeFileSync(file, content);
}
