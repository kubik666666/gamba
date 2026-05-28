const fotbalTymy = [
  "AC Sparta Praha",
  "SK Slavia Praha",
  "FC Viktoria Plzeň",
  "FC Baník Ostrava",
  "FC Slovan Liberec",
  "FK Jablonec",
  "Bohemians Praha 1905",
  "SK Sigma Olomouc",
  "FC Hradec Králové",
  "FK Teplice"
];

const hokejTymy = [
  "HC Sparta Praha",
  "HC Dynamo Pardubice",
  "HC Oceláři Třinec",
  "HC Vítkovice Ridera",
  "HC Kometa Brno",
  "Bílí Tygři Liberec",
  "Mountfield HK",
  "Rytíři Kladno",
  "HC VERVA Litvínov",
  "HC Škoda Plzeň"
];

let activeSport = "fotbal";
let matches = [];
let selectedBet = null;

document.addEventListener("DOMContentLoaded", () => {
  generateMatches();
  updateCoinsDisplay();
});

function switchSport(sport) {
  if (sport === activeSport) return;
  activeSport = sport;

  document.querySelectorAll(".sport-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(sport));
  });

  resetBet();
  generateMatches();
}

function generateMatches() {
  matches = [];
  const tymyList = activeSport === "fotbal" ? [...fotbalTymy] : [...hokejTymy];
  
  for (let i = 0; i < 3; i++) {
    if (tymyList.length < 2) break;

    const homeIdx = Math.floor(Math.random() * tymyList.length);
    const homeTeam = tymyList.splice(homeIdx, 1)[0];

    const awayIdx = Math.floor(Math.random() * tymyList.length);
    const awayTeam = tymyList.splice(awayIdx, 1)[0];

    const odds1 = parseFloat((1.3 + Math.random() * 2.8).toFixed(2));
    const odds2 = parseFloat((1.3 + Math.random() * 2.8).toFixed(2));
    const oddsX = parseFloat((2.5 + Math.random() * 2.0).toFixed(2));

    matches.push({
      id: i,
      homeTeam,
      awayTeam,
      odds1,
      oddsX,
      odds2
    });
  }

  renderMatches();
}

function renderMatches() {
  const container = document.getElementById("matches-list");
  container.innerHTML = "";

  matches.forEach((match, index) => {
    const card = document.createElement("div");
    card.className = "match-card";
    
    card.innerHTML = `
      <div class="match-teams">${match.homeTeam} vs ${match.awayTeam}</div>
      <div class="odds-container">
        <button class="odds-btn" data-match="${match.id}" data-type="1" onclick="selectOdds(${index}, '1', ${match.odds1}, this)">
          <span class="odds-label">1 (Domácí)</span>
          <span class="odds-value">${match.odds1}</span>
        </button>
        <button class="odds-btn" data-match="${match.id}" data-type="X" onclick="selectOdds(${index}, 'X', ${match.oddsX}, this)">
          <span class="odds-label">X (Remíza)</span>
          <span class="odds-value">${match.oddsX}</span>
        </button>
        <button class="odds-btn" data-match="${match.id}" data-type="2" onclick="selectOdds(${index}, '2', ${match.odds2}, this)">
          <span class="odds-label">2 (Hosté)</span>
          <span class="odds-value">${match.odds2}</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function selectOdds(matchIndex, type, odds, btnElement) {
  const match = matches[matchIndex];
  
  document.querySelectorAll(".odds-btn").forEach(btn => btn.classList.remove("active"));
  
  btnElement.classList.add("active");

  let typeText = "";
  if (type === "1") typeText = `Výhra ${match.homeTeam}`;
  else if (type === "X") typeText = "Remíza";
  else if (type === "2") typeText = `Výhra ${match.awayTeam}`;

  selectedBet = {
    matchIndex,
    type,
    odds,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam
  };

  const summary = document.getElementById("bet-summary");
  summary.innerHTML = `Vybráno: <span>${typeText}</span> s kurzem <span>${odds}</span>`;

  document.getElementById("sazeni-btn").disabled = false;
}

function resetBet() {
  selectedBet = null;
  document.getElementById("bet-summary").innerHTML = "Vyberte zápas a kurz na lístek.";
  document.getElementById("sazeni-btn").disabled = true;
}

function placeBet() {
  const resultBox = document.getElementById("sazeni-result-box");
  const resultScore = document.getElementById("result-score");
  const resultText = document.getElementById("result-text");

  if (!selectedBet) {
    alert("⚠️ Nejprve kliknutím vyberte kurz ze zápasu!");
    return;
  }

  const betAmount = parseInt(document.getElementById("sazeni-bet").value);
  if (isNaN(betAmount) || betAmount < 10) {
    alert("⚠️ Minimální sázka je 10 mincí.");
    return;
  }

  if (betAmount > coins) {
    alert("⚠️ Nemáte dostatek mincí!");
    return;
  }

  coins -= betAmount;
  saveCoins();
  updateCoinsDisplay();

  let homeGoals, awayGoals;
  if (activeSport === "fotbal") {
    homeGoals = Math.floor(Math.random() * 5);
    awayGoals = Math.floor(Math.random() * 5);
  } else {
    homeGoals = Math.floor(Math.random() * 8);
    awayGoals = Math.floor(Math.random() * 8);
  }

  let finalOutcome = "";
  if (homeGoals > awayGoals) finalOutcome = "1";
  else if (homeGoals === awayGoals) finalOutcome = "X";
  else finalOutcome = "2";

  const isWin = selectedBet.type === finalOutcome;
  let text = "";

  resultBox.className = "sazeni-result-box";

  if (isWin) {
    const payout = Math.round(betAmount * selectedBet.odds);
    coins += payout;
    saveCoins();
    updateCoinsDisplay();

    resultBox.classList.add("win");
    text = `🎉 Skvělý tip! Vyhráváš ${payout} mincí!`;
  } else {
    resultBox.classList.add("lose");
    text = `😢 Nevyšlo to. Ztrácíš ${betAmount} mincí.`;
  }

  resultScore.textContent = `${selectedBet.homeTeam} ${homeGoals} : ${awayGoals} ${selectedBet.awayTeam}`;
  resultText.textContent = text;
  resultBox.style.display = "flex";

  resetBet();
  generateMatches();
}
