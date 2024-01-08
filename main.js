import data from "./data.js";

const startButton = document.getElementById("startGame");
const finishButton = document.createElement("button");
finishButton.classList.add("btn");
finishButton.textContent = "Finish";
finishButton.addEventListener("click", finishGame);

let isGameActive = false;

function createShuffleData(data) {
  let id = 0;
  const result = [...data, ...data]
    .sort(() => 0.5 - Math.random())
    .map((card) => {
      return {
        ...card,
        id: id++,
      };
    });
  return result;
}

const buttonElem = document.getElementById("startGame");

function game() {
  const cardsContainerElement = document.getElementById("cards");
  const resultElement = document.createElement("div");
  resultElement.className = "result";

  cardsContainerElement.innerHTML = "";

  const cardsData = createShuffleData(data);

  let compareCardArr = [];
  let compareCardElements = [];

  cardsData.forEach((card) => {
    const cardsItemElement = cardItem(card);

    cardsItemElement.addEventListener("click", (e) => {
      if (
        compareCardArr.length >= 2 ||
        e.currentTarget.classList.contains("show")
      )
        return;

      compareCardArr.push(card);
      compareCardElements.push(e.currentTarget);

      cardsItemElement.classList.add("show");

      if (compareCardArr.length === 2) {
        const [cardA, cardB] = compareCardArr;
        if (cardA.code !== cardB.code) {
          setTimeout(() => {
            compareCardElements[0].classList.remove("show");
            compareCardElements[1].classList.remove("show");

            if (compareCardElements[0].active) {
              compareCardElements[0].active = false;
            }
            if (compareCardElements[1].active) {
              compareCardElements[1].active = false;
            }

            compareCardElements = [];
            compareCardArr = [];
          }, 1000);
        } else {
          compareCardElements[0].active = true;
          compareCardElements[1].active = true;

          compareCardArr = [];
          compareCardElements = [];
        }
      }
    });

    resultElement.appendChild(cardsItemElement);
  });

  cardsContainerElement.appendChild(resultElement);
  buttonElem.parentNode.replaceChild(finishButton, buttonElem);
}

function cardItem({ emoji }) {
  const cardItemsElement = document.createElement("div");
  cardItemsElement.className = "cards-item";

  const cardInnerItemElem = document.createElement("div");
  cardInnerItemElem.className = "cards-item-inner";

  const cardItemFrontElem = document.createElement("div");
  cardItemFrontElem.className = "cards-item-front";
  cardItemFrontElem.textContent = emoji;

  const cardItemBackElem = document.createElement("div");
  cardItemBackElem.className = "cards-item-back";

  cardInnerItemElem.append(cardItemFrontElem, cardItemBackElem);
  cardItemsElement.appendChild(cardInnerItemElem);
  return cardItemsElement;
}

buttonElem.addEventListener("click", () => {
  resetGame();
  startTimer();
});

function finishGame() {
  stopTimer();
  revealAllCards();

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "flex";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const resultMessage = document.createElement("p");
  resultMessage.textContent = "Game Over!";

  const startAgainButton = document.createElement("button");
  startAgainButton.textContent = "Start Again";
  startAgainButton.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.removeChild(modal);
    resetGame();
  });

  modalContent.appendChild(resultMessage);
  modalContent.appendChild(startAgainButton);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
}

let gameTimer;
let gameTimeInSeconds = 0;

function resetGame() {
  hideAllCards();
  isGameActive = false;
  gameTimeInSeconds = 60;

  const oldCardsContainer = document.getElementById("cards");
  oldCardsContainer.parentNode.removeChild(oldCardsContainer);

  const newCardsContainer = document.createElement("section");
  newCardsContainer.id = "cards";
  document.querySelector(".container").appendChild(newCardsContainer);

  oldCardsContainer.innerHTML = "";

  isGameActive = true;
  game();
}

function hideAllCards() {
  const cards = document.querySelectorAll(".cards-item");
  cards.forEach((card) => {
    card.classList.remove("show");
  });
}

function revealAllCards() {
  const cards = document.querySelectorAll(".cards-item");
  cards.forEach((card) => {
    card.classList.add("show");
  });
}

function startTimer() {
  gameTimer = setInterval(() => {
    gameTimeInSeconds--;

    if (gameTimeInSeconds <= 0) {
      finishGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(gameTimer);
}
