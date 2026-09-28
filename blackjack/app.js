const themeToggle = document.querySelector("#theme-toggle");
const chipButtons = document.querySelectorAll(".chip[data-amount]");
const dealButton = document.querySelector("#deal-button");
const clearBetButton = document.querySelector("#clear-bet");
const hitButton = document.querySelector("#hit-button");
const standButton = document.querySelector("#stand-button");
const doubleButton = document.querySelector("#double-button");
const splitButton = document.querySelector("#split-button");
const surrenderButton = document.querySelector("#surrender-button");
const nextRoundButton = document.querySelector("#next-round");
const insuranceActions = document.querySelector("#insurance-actions");
const insuranceButton = document.querySelector("#insurance-button");
const insuranceCostDisplay = document.querySelector("#insurance-cost");
const declineInsuranceButton = document.querySelector("#decline-insurance");
const balanceDisplay = document.querySelector("#balance");
const betDisplay = document.querySelector("#bet-total");
const dealerCardsDisplay = document.querySelector("#dealer-cards");
const playerHandsDisplay = document.querySelector("#player-hands");
const dealerTotalDisplay = document.querySelector("#dealer-total");
const roundNumberDisplay = document.querySelector("#round-number");
const gameMessage = document.querySelector("#game-message");

const rules = {
  deckCount: 6,
  startingBalance: 500,
  minimumBet: 1,
  maximumHands: 4,
  reshuffleAt: 52,
};

const suits = [
  { name: "corazones", symbol: "♥", red: true },
  { name: "diamantes", symbol: "♦", red: true },
  { name: "tréboles", symbol: "♣", red: false },
  { name: "picas", symbol: "♠", red: false },
];

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const state = {
  shoe: createShoe(),
  balance: rules.startingBalance,
  bet: 0,
  dealerHand: [],
  playerHands: [],
  activeHandIndex: 0,
  insuranceBet: 0,
  phase: "betting",
  round: 0,
};

function getCardValue(rank) {
  if (rank === "A") {
    return 11;
  }

  if (["J", "Q", "K"].includes(rank)) {
    return 10;
  }

  return Number(rank);
}

function createShoe() {
  const cards = [];

  for (let deck = 0; deck < rules.deckCount; deck += 1) {
    for (const suit of suits) {
      for (const rank of ranks) {
        const value = getCardValue(rank);
        cards.push({ rank, value, suit: suit.name, symbol: suit.symbol, red: suit.red });
      }
    }
  }

  // Mezcla el mazo en el sitio, intercambiando cada carta con otra posición aleatoria.
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }

  return cards;
}

function scoreHand(cards) {
  let total = 0;
  let highAces = 0;

  for (const card of cards) {
    total += card.value;

    if (card.rank === "A") {
      highAces += 1;
    }
  }

  // Cada as puede bajar de 11 a 1 si la mano supera 21.
  while (total > 21 && highAces > 0) {
    total -= 10;
    highAces -= 1;
  }

  return { total, isSoft: highAces > 0 };
}

function drawCard() {
  if (state.shoe.length === 0) {
    state.shoe = createShoe();
  }

  return state.shoe.pop();
}

function createCardElement(card, isHidden = false) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("playing-card");

  if (isHidden) {
    cardElement.classList.add("card-back");
    cardElement.setAttribute("aria-label", "Carta boca abajo");
  } else {
    cardElement.setAttribute("aria-label", `${card.rank} de ${card.suit}`);

    if (card.red) {
      cardElement.classList.add("red-card");
    }
  }

  if (isHidden) {
    const backMark = document.createElement("span");
    backMark.className = "card-back-inner";
    backMark.setAttribute("aria-hidden", "true");
    backMark.textContent = "21";
    cardElement.append(backMark);
    return cardElement;
  }

  const corner = document.createElement("span");
  corner.className = "card-corner";
  corner.textContent = card.rank;

  const cornerSuit = document.createElement("small");
  cornerSuit.textContent = card.symbol;
  corner.append(cornerSuit);

  const largeSuit = document.createElement("span");
  largeSuit.className = `card-suit${card.red ? "" : " black-suit"}`;
  largeSuit.setAttribute("aria-hidden", "true");
  largeSuit.textContent = card.symbol;

  const bottomCorner = corner.cloneNode(true);
  bottomCorner.classList.add("card-corner-bottom");
  bottomCorner.setAttribute("aria-hidden", "true");

  cardElement.append(corner, largeSuit, bottomCorner);
  return cardElement;
}

function renderHand(container, cards, hiddenIndex = -1) {
  container.replaceChildren();

  for (let index = 0; index < cards.length; index += 1) {
    const cardElement = createCardElement(cards[index], index === hiddenIndex);
    container.append(cardElement);
  }
}

function createPlayerHand(cards, bet, isSplit = false, splitAces = false) {
  return { cards, bet, isSplit, splitAces, hasActed: false, status: "active" };
}

function getActiveHand() {
  return state.playerHands[state.activeHandIndex];
}

function isNaturalBlackjack(hand) {
  return !hand.isSplit && hand.cards.length === 2 && scoreHand(hand.cards).total === 21;
}

function getTotalWager() {
  if (state.phase === "betting") {
    return state.bet;
  }

  let total = 0;

  for (const hand of state.playerHands) {
    total += hand.bet;
  }

  return total;
}

function renderPlayerHands() {
  playerHandsDisplay.replaceChildren();

  for (let index = 0; index < state.playerHands.length; index += 1) {
    const hand = state.playerHands[index];
    const isActive = index === state.activeHandIndex && state.phase === "playerTurn";
    const handElement = document.createElement("section");
    handElement.classList.add("player-hand");

    if (isActive) {
      handElement.classList.add("active-hand");
    }

    const statusText = hand.status === "active"
      ? isActive ? "MANO ACTIVA" : "EN ESPERA"
      : hand.status === "stood" ? "PLANTADA"
        : hand.status === "busted" ? "PASADA" : "RENDIDA";
    handElement.setAttribute("aria-label", `Mano ${index + 1}: ${statusText.toLowerCase()}`);

    const heading = document.createElement("div");
    heading.className = "hand-heading";

    const handName = document.createElement("div");
    handName.className = "player-name";

    const title = document.createElement("h3");
    title.textContent = `Mano ${index + 1}`;

    const status = document.createElement("span");
    status.className = "hand-status";
    status.textContent = statusText;
    handName.append(title, status);

    const total = document.createElement("span");
    total.className = "hand-total";
    total.textContent = String(scoreHand(hand.cards).total);
    heading.append(handName, total);

    const cards = document.createElement("div");
    cards.className = "cards player-cards";
    cards.setAttribute("aria-label", `Cartas de la mano ${index + 1}`);
    renderHand(cards, hand.cards);

    const betLine = document.createElement("div");
    betLine.className = "bet-line";
    const betLabel = document.createElement("span");
    betLabel.textContent = "APUESTA DE ESTA MANO";
    const betAmount = document.createElement("strong");
    const chipSymbol = document.createElement("i");
    chipSymbol.textContent = "◆";
    betAmount.append(chipSymbol, ` ${hand.bet}`);
    betLine.append(betLabel, betAmount);

    handElement.append(heading, cards, betLine);
    playerHandsDisplay.append(handElement);
  }
}

function render() {
  const isBetting = state.phase === "betting";
  const activeHand = getActiveHand();
  const isPlayerTurn = state.phase === "playerTurn" && activeHand?.status === "active";
  const canSplit = isPlayerTurn
    && activeHand.cards.length === 2
    && activeHand.cards[0].value === activeHand.cards[1].value
    && !activeHand.splitAces
    && state.playerHands.length < rules.maximumHands
    && state.balance >= activeHand.bet;

  balanceDisplay.textContent = String(state.balance);
  betDisplay.textContent = String(getTotalWager());
  roundNumberDisplay.textContent = String(state.round).padStart(2, "0");
  dealButton.disabled = !isBetting || state.bet < rules.minimumBet;
  clearBetButton.disabled = !isBetting || state.bet === 0;
  hitButton.disabled = !isPlayerTurn || activeHand.splitAces;
  standButton.disabled = !isPlayerTurn;
  doubleButton.disabled = !isPlayerTurn
    || activeHand.cards.length !== 2
    || activeHand.splitAces
    || state.balance < activeHand.bet;
  splitButton.disabled = !canSplit;
  surrenderButton.disabled = !isPlayerTurn
    || activeHand.hasActed
    || activeHand.cards.length !== 2
    || activeHand.isSplit;
  nextRoundButton.hidden = state.phase !== "roundOver";
  insuranceActions.hidden = state.phase !== "insuranceDecision";
  insuranceCostDisplay.textContent = String(state.bet / 2);
  insuranceButton.disabled = state.balance < state.bet / 2;

  if (isBetting && state.balance < rules.minimumBet) {
    gameMessage.textContent = `Saldo insuficiente: necesitas al menos ${rules.minimumBet} ficha.`;
  }

  for (const chipButton of chipButtons) {
    const amount = Number(chipButton.dataset.amount);
    chipButton.disabled = !isBetting || amount > state.balance;
  }

  // La segunda carta del crupier permanece oculta durante el turno del jugador.
  const hidesDealerCard = state.phase === "playerTurn" || state.phase === "insuranceDecision";
  const hiddenDealerCard = hidesDealerCard ? 1 : -1;
  renderHand(dealerCardsDisplay, state.dealerHand, hiddenDealerCard);
  renderPlayerHands();

  const dealerVisibleCards = hidesDealerCard
    ? state.dealerHand.slice(0, 1)
    : state.dealerHand;
  dealerTotalDisplay.textContent = dealerVisibleCards.length
    ? String(scoreHand(dealerVisibleCards).total)
    : "—";
}

function placeChip(amount) {
  if (state.phase !== "betting" || amount > state.balance) {
    return;
  }

  state.balance -= amount;
  state.bet += amount;
  render();
}

function clearBet() {
  if (state.phase !== "betting") {
    return;
  }

  state.balance += state.bet;
  state.bet = 0;
  render();
}

function dealInitialHands() {
  if (state.phase !== "betting" || state.bet < rules.minimumBet) {
    return;
  }

  // Se mezcla entre rondas, no mientras se están repartiendo cartas.
  if (state.shoe.length < rules.reshuffleAt) {
    state.shoe = createShoe();
  }

  state.round += 1;
  const firstPlayerCard = drawCard();
  const dealerUpCard = drawCard();
  const secondPlayerCard = drawCard();
  const dealerHoleCard = drawCard();
  state.playerHands = [createPlayerHand([firstPlayerCard, secondPlayerCard], state.bet)];
  state.dealerHand = [dealerUpCard, dealerHoleCard];
  state.activeHandIndex = 0;
  state.insuranceBet = 0;

  if (dealerUpCard.rank === "A") {
    state.phase = "insuranceDecision";
    gameMessage.textContent = "El crupier muestra un as. Decide si quieres seguro.";
    render();
    return;
  }

  resolveInitialBlackjack();
}

function resolveInitialBlackjack() {
  const dealerNatural = scoreHand(state.dealerHand).total === 21;
  const playerNatural = isNaturalBlackjack(state.playerHands[0]);

  if (dealerNatural) {
    if (state.insuranceBet > 0) {
      state.balance += state.insuranceBet * 3;
    }

    const insuranceMessage = state.insuranceBet > 0 ? " El seguro paga 2:1." : "";

    if (playerNatural) {
      state.balance += state.playerHands[0].bet;
      endRound(`Ambos tenéis blackjack natural. Empate.${insuranceMessage}`);
    } else {
      endRound(`Blackjack natural del crupier.${insuranceMessage} Pierdes la apuesta principal.`);
    }
    return;
  }

  if (playerNatural) {
    state.balance += state.playerHands[0].bet * 2.5;
    endRound("Blackjack natural. Cobras 3:2.");
    return;
  }

  state.phase = "playerTurn";
  gameMessage.textContent = "Reparto completo. Ya puedes decidir tu jugada.";
  render();
}

function takeInsurance() {
  if (state.phase !== "insuranceDecision" || state.balance < state.bet / 2) {
    return;
  }

  state.insuranceBet = state.bet / 2;
  state.balance -= state.insuranceBet;
  resolveInitialBlackjack();
}

function declineInsurance() {
  if (state.phase !== "insuranceDecision") {
    return;
  }

  resolveInitialBlackjack();
}

function endRound(message) {
  state.phase = "roundOver";
  gameMessage.textContent = message;
  render();
}

function payHand(hand, result) {
  // La apuesta ya se descontó; una victoria devuelve apuesta y premio.
  if (result === "blackjack") {
    state.balance += hand.bet * 2.5;
  } else if (result === "win") {
    state.balance += hand.bet * 2;
  } else if (result === "push") {
    state.balance += hand.bet;
  } else if (result === "surrender") {
    state.balance += hand.bet / 2;
  }
}

function playDealerTurn() {
  state.phase = "dealerTurn";
  const handsStillPlaying = state.playerHands.some((hand) => hand.status === "stood");

  if (handsStillPlaying) {
    // Con 17 suave el total también es 17, así que el crupier se planta.
    while (scoreHand(state.dealerHand).total < 17) {
      state.dealerHand.push(drawCard());
    }
  }

  const dealerTotal = scoreHand(state.dealerHand).total;
  const results = [];

  for (let index = 0; index < state.playerHands.length; index += 1) {
    const hand = state.playerHands[index];
    const handName = `Mano ${index + 1}`;

    if (hand.status === "busted") {
      results.push(`${handName}: te pasaste.`);
      continue;
    }

    if (hand.status === "surrendered") {
      results.push(`${handName}: rendición.`);
      continue;
    }

    const playerTotal = scoreHand(hand.cards).total;

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      payHand(hand, "win");
      results.push(`${handName}: ganas.`);
    } else if (playerTotal === dealerTotal) {
      payHand(hand, "push");
      results.push(`${handName}: empate.`);
    } else {
      results.push(`${handName}: pierdes.`);
    }
  }

  const insuranceMessage = state.insuranceBet > 0 ? " El seguro no gana." : "";
  endRound(`Crupier: ${dealerTotal}.${insuranceMessage} ${results.join(" ")}`);
}

function advanceHand() {
  for (let index = state.activeHandIndex + 1; index < state.playerHands.length; index += 1) {
    if (state.playerHands[index].status === "active") {
      state.activeHandIndex = index;
      gameMessage.textContent = `Ahora juegas la mano ${index + 1}.`;
      render();
      return;
    }
  }

  playDealerTurn();
}

function hit() {
  const hand = getActiveHand();

  if (state.phase !== "playerTurn" || !hand || hand.status !== "active" || hand.splitAces) {
    return;
  }

  hand.hasActed = true;
  hand.cards.push(drawCard());
  const total = scoreHand(hand.cards).total;

  if (total > 21) {
    hand.status = "busted";
    advanceHand();
  } else if (total === 21) {
    hand.status = "stood";
    advanceHand();
  } else {
    gameMessage.textContent = `Tienes ${total} puntos. ¿Pides otra carta o te plantas?`;
    render();
  }
}

function stand() {
  const hand = getActiveHand();

  if (state.phase !== "playerTurn" || !hand || hand.status !== "active") {
    return;
  }

  hand.hasActed = true;
  hand.status = "stood";
  advanceHand();
}

function doubleDown() {
  const hand = getActiveHand();

  if (state.phase !== "playerTurn" || !hand || hand.status !== "active"
    || hand.cards.length !== 2 || hand.splitAces || state.balance < hand.bet) {
    return;
  }

  state.balance -= hand.bet;
  hand.bet *= 2;
  hand.hasActed = true;
  // Doblar siempre termina el turno del jugador después de una carta.
  hand.cards.push(drawCard());
  const total = scoreHand(hand.cards).total;

  if (total > 21) {
    hand.status = "busted";
  } else {
    hand.status = "stood";
  }

  gameMessage.textContent = `Doblas y recibes una carta (${total}).`;
  advanceHand();
}

function splitHand() {
  const hand = getActiveHand();
  const canSplit = state.phase === "playerTurn" && hand?.status === "active"
    && hand.cards.length === 2
    && hand.cards[0].value === hand.cards[1].value
    && !hand.splitAces
    && state.playerHands.length < rules.maximumHands
    && state.balance >= hand.bet;

  if (!canSplit) {
    return;
  }

  const [firstCard, secondCard] = hand.cards;
  const splitAces = firstCard.rank === "A" && secondCard.rank === "A";
  state.balance -= hand.bet;

  const firstHand = createPlayerHand([firstCard, drawCard()], hand.bet, true, splitAces);
  const secondHand = createPlayerHand([secondCard, drawCard()], hand.bet, true, splitAces);
  state.playerHands.splice(state.activeHandIndex, 1, firstHand, secondHand);

  if (splitAces) {
    // Las manos con ases divididos reciben una sola carta y se plantan.
    firstHand.status = "stood";
    secondHand.status = "stood";
    advanceHand();
    return;
  }

  gameMessage.textContent = "Mano dividida. Juega primero la mano de la izquierda.";
  render();
}

function surrender() {
  const hand = getActiveHand();

  if (state.phase !== "playerTurn" || !hand || hand.status !== "active"
    || hand.hasActed || hand.cards.length !== 2 || hand.isSplit) {
    return;
  }

  hand.status = "surrendered";
  payHand(hand, "surrender");
  advanceHand();
}

function startNextRound() {
  if (state.phase !== "roundOver") {
    return;
  }

  state.bet = 0;
  state.dealerHand = [];
  state.playerHands = [];
  state.activeHandIndex = 0;
  state.insuranceBet = 0;
  state.phase = "betting";
  gameMessage.textContent = "Elige tus fichas y reparte para empezar.";
  render();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro"
  );
}

themeToggle.addEventListener("click", toggleTheme);

for (const chipButton of chipButtons) {
  chipButton.addEventListener("click", () => {
    placeChip(Number(chipButton.dataset.amount));
  });
}

dealButton.addEventListener("click", dealInitialHands);
clearBetButton.addEventListener("click", clearBet);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
doubleButton.addEventListener("click", doubleDown);
splitButton.addEventListener("click", splitHand);
surrenderButton.addEventListener("click", surrender);
insuranceButton.addEventListener("click", takeInsurance);
declineInsuranceButton.addEventListener("click", declineInsurance);
nextRoundButton.addEventListener("click", startNextRound);

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "n" && !event.repeat) {
    toggleTheme();
  }
});

render();