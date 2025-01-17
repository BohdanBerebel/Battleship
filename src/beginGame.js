export { start, verifyStart };
let start = false;
function verifyStart() {
  const ships = document.querySelectorAll(".unit");
  const playerBoard = document.querySelector("#player");
  const button = document.querySelector("#flip");
  const divWithShips = document.querySelector(".ships");

  if (!ships.length) {
    start = true;
    playerBoard.style.pointerEvents = "none";
    button.remove();
    divWithShips.remove();
    return true;
  }
}
