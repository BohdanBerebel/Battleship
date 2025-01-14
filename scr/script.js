// import Ship from "./ship";
// import Gameboard from "./gameboard";

const boards = document.querySelectorAll(".board");

boards.forEach((board) => {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    // cell.textContent = "One cell";
    board.appendChild(cell);
  }
  board.addEventListener("click", (e) => {
    e.target.style.backgroundColor = "yellow";
  });
});

const flipButton = document.querySelector("#flip-button");
const optionContainer = document.querySelector(".option-container");

let angle = 0;
function flip() {
  const optionShips = [...optionContainer.children];
  // console.log(optionShips);
  if (angle === 0) angle = 90;
  else angle = 0;
  optionShips.forEach((optionShip) => {
    optionShip.style.transform = `rotate(${angle}deg)`;
  });
}

flipButton.addEventListener("click", flip);

const gamesboardContainer = document.querySelector("#gamesboard-container");
function createBoard(color, user) {
  const gameboardContainer = document.createElement("div");
  gameboardContainer.classList.add("game-board");
  gameboardContainer.style.backgroundColor = color;
  gameboardContainer.id = user;

  for (let i = 0; i < 100; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    gameboardContainer.append(block);
  }

  gamesboardContainer.append(gameboardContainer);
}
createBoard("pink", "player");
createBoard("yellow", "computer");

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}
const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];
let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  let validStart = isHorizontal
    ? startIndex <= 100 - ship.length
      ? startIndex
      : 100 - ship.length
    : startIndex < 100 - 10 * (ship.length - 1)
    ? startIndex
    : startIndex - 10 * (ship.length - 1);

  let shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[+validStart + i]);
    } else {
      shipBlocks.push(allBoardBlocks[+validStart + i * 10]);
    }
  }
  let valid;
  if (isHorizontal) {
    valid = shipBlocks[0].id % 10 <= 10 - shipBlocks.length;

    // shipBlocks.every(
    //   (_shipBlock, index) =>
    //     (valid = shipBlocks[0].id % 10 !== 10 - shipBlocks.length - (index + 1))
    // );
  } else {
    valid = Math.trunc(shipBlocks[0].id / 10) <= 10 - ship.length;
    // shipBlocks.every(
    //   (_shipBlock, index) =>
    //     (valid = shipBlocks[0].id % 10 < 90 + (10 * index + 1))
    // );
  }

  const notTaken = shipBlocks.every(
    (shipBlock) => !shipBlock.classList.contains("taken")
  );

  return { shipBlocks, valid, notTaken };
}
// console.log(destroyer);

function addShipPiece(user, ship, startId) {
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  let randomBoolean = Math.random() < 0.5;
  let isHorizontal = user === "player" ? angle === 0 : randomBoolean;

  let randomStartIndex = Math.floor(Math.random() * 100);

  let startIndex = startId ? startId : randomStartIndex;

  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    if (user === "computer") addShipPiece("computer", ship); //!!!!!!!!!!!!!!
    if (user === "player") notDropped = true;
  }
}
ships.forEach((ship) => {
  addShipPiece("computer", ship);
});
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach((optionShip) => {
  optionShip.addEventListener("dragstart", dragStart);
});

const allPlayerBlocks = document.querySelectorAll("#player div");
allPlayerBlocks.forEach((playerBlocks) => {
  playerBlocks.addEventListener("dragover", dragOver);
  playerBlocks.addEventListener("drop", dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
  // console.log();
}

function dragOver(e) {
  e.preventDefault();
  const ship = ships[draggedShip.id];
  highlightArea(e.target.id, ship);
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  addShipPiece("player", ship, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
}

function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll("#player div");
  let isHorizontal = angle === 0;
  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );
  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add("hover");
      setTimeout(() => shipBlock.classList.remove("hover"), 500);
    });
  }
}

// https://www.youtube.com/watch?v=Ubh_k18sX4E

let gameOver = false;
let playerTurn;

const startButton = document.querySelector("#start-button");
const info = document.querySelector("#info");
const turnDisplay = document.querySelector("#turn-display");

function startGame() {
  if (playerTurn === undefined) {
    if (optionContainer.children.length) {
      info.textContent = "Place your ships";
    } else {
      const allBoardBlock = document.querySelectorAll("#computer div");
      allBoardBlock.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
      playerTurn = true;
      turnDisplay.textContent = "Your Go!";
      info.textContent = "The game's started!";
    }
  }
}

startButton.addEventListener("click", startGame);

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
  if (!gameOver) {
    if (e.target.classList.contains("taken")) {
      e.target.classList.add("boom");
      info.textContent = "You hit a ship!";
      let classes = Array.from(e.target.classList);
      classes = classes.filter((className) => className !== "block");
      classes = classes.filter((className) => className !== "boom");
      classes = classes.filter((className) => className !== "taken");
      playerHits.push(...classes);
      checkScore("player", playerHits, playerSunkShips);
    }
    if (!e.target.classList.contains("taken")) {
      info.textContent = "You've missed";
      e.target.classList.add("empty");
    }
    playerTurn = false;
    const allBoardBlock = document.querySelectorAll("#computer div");
    allBoardBlock.forEach((block) => block.replaceWith(block.cloneNode(true)));
    setTimeout(computerGo, 500);
  }
}

function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = "Computer's Go!";
    info.textContent = "The computer is thinking...!";

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * 100);
      const allBoardBlocks = document.querySelectorAll("#player div");
      if (
        allBoardBlocks[randomGo].classList.contains("taken") &&
        allBoardBlocks[randomGo].classList.contains("boom")
      ) {
        computerGo();
        return;
      } else if (
        allBoardBlocks[randomGo].classList.contains("taken") &&
        !allBoardBlocks[randomGo].classList.contains("boom")
      ) {
        allBoardBlocks[randomGo].classList.add("boom");
        info.textContent = "The computer hit your ship!";
        let classes = Array.from(allBoardBlocks[randomGo].classList);
        classes = classes.filter((className) => className !== "block");
        classes = classes.filter((className) => className !== "boom");
        classes = classes.filter((className) => className !== "taken");
        computerHits.push(...classes);
        checkScore("computer", computerHits, computerSunkShips);
      } else {
        info.textContent = "Nothing hit this time.";
        allBoardBlocks[randomGo].classList.add("empty");
      }
    }, 1000);

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Your Go!";
      info.textContent = "Take your go!";
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
    }, 1000);
  }
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((storedShipName) => storedShipName === shipName)
        .length === shipLength
    ) {
      if (user === "player") {
        info.textContent = `You sunk the computer's ${shipName}`;
        playerHits = userHits.filter(
          (storedShipName) => storedShipName != shipName
        );
      }
      if (user === "computer") {
        info.textContent = `The computer sunk your ${shipName}`;
        computerHits = userHits.filter(
          (storedShipName) => storedShipName != shipName
        );
      }
      userSunkShips.push(shipName);
    }
  }
  checkShip("destroyer", 2);
  checkShip("submarine", 3);
  checkShip("cruiser", 3);
  checkShip("battleship", 4);
  checkShip("carrier", 5);

  if (playerSunkShips.length === 5) {
    info.textContent = "You won!";
    gameOver = true;
  }
  if (computerSunkShips.length === 5) {
    info.textContent = "Computer won!";
    gameOver = true;
  }
}

//1:38:20
