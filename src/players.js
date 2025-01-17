import Ship from "./ship";
import Gameboard from "./gameboard";

export default class Players {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.ships = [new Ship(3), new Ship(4), new Ship(5)];
    if (name === "computer") this.placeShipForComputer();
  }

  #checkLengthValidity(coordinates, ship, isHorizontal) {
    let [row, column] = coordinates;
    const length = ship.length;
    if (isHorizontal) {
      return column <= 10 - length;
    } else {
      return row <= 10 - length;
    }
  }

  checkPlaceValidity(coordinates, ship, isHorizontal, gameboard) {
    if (!this.#checkLengthValidity(coordinates, ship, isHorizontal))
      return false;
    let [row, column] = coordinates;
    const length = ship.length;
    if (isHorizontal) {
      for (let i = column, j = 0; j < length; i++, j++) {
        if (gameboard[row][i]) return false;
      }
      return true;
    } else {
      for (let i = row, j = 0; j < length; i++, j++) {
        if (gameboard[i][column]) return false;
      }
      return true;
    }
  }

  randomCoordinates() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }

  placeShipForComputer() {
    this.ships.forEach((ship) => {
      let [row, column] = this.randomCoordinates();
      let isHorizontal = Math.random() < 0.5;
      while (
        !this.checkPlaceValidity(
          [row, column],
          ship,
          isHorizontal,
          this.gameboard.gameboard
        )
      ) {
        [row, column] = this.randomCoordinates();
      }
      const allBlocks = document.querySelectorAll("#computer .row .cell");
      for (
        let i = isHorizontal ? column : row, j = 0;
        j < ship.length;
        i++, j++
      ) {
        if (isHorizontal) {
          this.gameboard.gameboard[row][i] = ship;
          allBlocks[row * 10 + i].classList.add("ship");
        } else {
          this.gameboard.gameboard[i][column] = ship;
          allBlocks[i * 10 + column].classList.add("ship");
        }
      }
    });
  }

  checkVictory() {
    for (let ship of this.ships) {
      if (!ship.sunk) return false;
    }
    return true;
  }

  placeShipForHumanPlayer(takenShip) {
    if (!takenShip) return;
    let { coordinates, isHorizontal, length } = takenShip;
    if (
      !this.checkPlaceValidity(
        coordinates,
        { length: length },
        isHorizontal,
        this.gameboard.gameboard
      )
    ) {
      return;
    }

    let [row, column] = coordinates;
    const allBlocks = document.querySelectorAll("#player .row .cell");
    for (let i = isHorizontal ? column : row, j = 0; j < length; i++, j++) {
      if (isHorizontal) {
        this.gameboard.gameboard[row][i] = this.ships[length - 3];
        allBlocks[row * 10 + i].classList.add("ship");
      } else {
        this.gameboard.gameboard[i][column] = this.ships[length - 3];
        allBlocks[i * 10 + column].classList.add("ship");
      }
    }
    takenShip.target.remove();
  }

  showGameOverNotification(player) {
    let name = player.name === "computer" ? "Human Player" : "Computer";

    const body = document.querySelector("body");
    const notification = document.createElement("p");
    notification.textContent = `${name} won! Congratulations!`;
    notification.classList.add("notification");
    body.appendChild(notification);
  }
}
