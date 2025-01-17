export default class Ship {
  constructor(length) {
    this.length = length;
    this.timesBeenHit = 0;
    this.sunk = false;
  }

  hit() {
    this.timesBeenHit++;
    this.isSunk();
  }

  isSunk() {
    if (this.length <= this.timesBeenHit) this.sunk = true;
  }
}
