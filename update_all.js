const fs = require('fs');

const cssAdditions = `
.bj-area {
  background: rgb(13, 5, 32);
  border-radius: 8px;
  padding: 15px;
  border: 2px solid gold;
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
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
  border: 1px solid lightgray;
  position: relative;
}

.bj-card.red { color: rgb(255, 68, 68); }
.bj-card.black { color: rgb(17, 17, 17); }
.bj-card.hidden { 
  background: repeating-linear-gradient(45deg, rgb(13, 5, 32), rgb(13, 5, 32) 10px, rgb(26, 10, 46) 10px, rgb(26, 10, 46) 20px); 
  border-color: gold; 
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
  content = content.replace(/<button class="deposit-btn" onclick="openDeposit\(\)">💵 Deposit<\/button>\s*<!-- Deposit Modal -->\s*<div id="deposit-modal" class="modal-overlay".*?<\/div>\s*<\/div>\s*<\/div>/s, 
    file === 'index.html' 
    ? '<a href="deposit/deposit.html" class="deposit-btn" style="text-decoration:none;">💵 Deposit</a>'
    : '<a href="../deposit/deposit.html" class="deposit-btn" style="text-decoration:none;">💵 Deposit</a>'
  );

  if (file === 'index.html' && !content.includes('Blackjack')) {
    content = content.replace(
      '  </div>\n\n  <script src="shared.js"></script>',
      `    <a href="blackjack/blackjack.html" class="game-link">\n      <span class="icon">🃏</span>\n      <span class="name">Blackjack</span>\n    </a>\n  </div>\n\n  <script src="shared.js"></script>`
    );
  }

  fs.writeFileSync(file, content);
}
