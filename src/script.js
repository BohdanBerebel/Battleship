import "./styles.css";
import Ship from "./ship";
import Gameboard from "./gameboard";
import Players from "./players";
import build from "./buildPlayGround";
import setHitChecker from "./hit";
import {} from "./flipShips";
import {
  resetTakenShip,
  startDragging,
  takenShip,
  drop,
  allowDrop,
} from "./dragingShips";
import { verifyStart } from "./beginGame";

build("player");
build("computer");

const computer = new Players("computer");
const player = new Players("player");
console.log(player);
console.log(computer);

setHitChecker(player, computer);
const allPlayersBlocks = document.querySelectorAll("#player .row .cell");
allPlayersBlocks.forEach((block) => {
  block.addEventListener("dragover", allowDrop);
  block.addEventListener("drop", (e) => {
    drop(e);
    player.placeShipForHumanPlayer(takenShip);
    if (verifyStart()) {
      const info = document.querySelector("#info");
      info.textContent = `${Gameboard.turn}'s turn to shoot`;
    }
    resetTakenShip();
  });
  block.removeEventListener("dragstart", startDragging);
});
