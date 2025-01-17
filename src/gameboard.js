export default class Gameboard {
  static turn = "Player";
  constructor() {
    this.gameboard = new Array(10)
      .fill(null)
      .map((one) => new Array(10).fill(null));
    // .map((one) => [])
  }
  receiveAttack(coordinates, player) {
    if (coordinates[0] === undefined) return;

    if (start) {
      let [row, column] = coordinates;
      const allBlocksOfPlayer =
        player.name === "computer"
          ? document.querySelectorAll("#computer .row .cell")
          : document.querySelectorAll("#player .row .cell");

      this.changeDisability();

      if (this.gameboard[row][column]) {
        this.gameboard[row][column].hit();
        this.gameboard[row][column] = null;
        allBlocksOfPlayer[row * 10 + column].classList.add("hit");
        allBlocksOfPlayer[row * 10 + column].classList.remove("ship");
        // allBlocksOfPlayer[row * 10 + column].style.pointerEvents = "none";
        if (player.checkVictory()) {
          const allBoards = document.querySelectorAll(".board");
          allBoards.forEach((board) => {
            board.style.pointerEvents = "none";
          });
          player.showGameOverNotification(player);
          return;
        }
      } else {
        allBlocksOfPlayer[row * 10 + column].classList.add("miss");
        // allBlocksOfPlayer[row * 10 + column].style.pointerEvents = "none";
        // allBlocks[row * 10 + column].classList.remove("ship");
      }
      Gameboard.#changeTurn();
      const info = document.querySelector("#info");
      info.textContent = `${Gameboard.turn}'s turn to shoot`;
    }
  }

  static #changeTurn() {
    Gameboard.turn = Gameboard.turn === "Player" ? "Computer" : "Player";
  }

  changeDisability() {
    const comp = document.querySelector("#computer");
    comp.style.pointerEvents =
      comp.style.pointerEvents === "none" ? "" : "none";
  }
}

import { start } from "./beginGame";
