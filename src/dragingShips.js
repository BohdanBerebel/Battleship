export { resetTakenShip, takenShip, startDragging, drop, allowDrop };

let takenShip = null;

function startDragging(e) {
  takenShip = {
    isHorizontal: e.target.style.flexDirection === "column" ? false : true,
    length: e.target.children.length,
    target: e.target,
  };
}

function allowDrop(event) {
  event.target.classList.add("shadow");
  setTimeout(() => {
    event.target.classList.remove("shadow");
  }, 500);
  event.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (!takenShip) return;
  takenShip.coordinates = [e.target.row, e.target.column];
}

function resetTakenShip() {
  takenShip = null;
}

const units = document.querySelectorAll(".unit");
units.forEach((unit) => {
  unit.addEventListener("dragstart", startDragging);
});
