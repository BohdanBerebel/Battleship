export default function setHitChecker(player, computer) {
  const allBoards = document.querySelectorAll(".board");
  const playerShots = new Set();
  const computerShots = new Set();
  allBoards.forEach((board) => {
    board.addEventListener("click", function hit(e) {
      if (targetChecker(playerShots, [e.target.row, e.target.column])) {
        computer.gameboard.receiveAttack(
          [e.target.row, e.target.column],
          computer
        );
      } else {
        return;
      }
      if (!computer.checkVictory()) {
        let random = [
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ];
        while (!targetChecker(computerShots, random)) {
          random = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
          ];
        }
        setTimeout(() => {
          player.gameboard.receiveAttack(random, player);
        }, 500);
      }
    });
  });
  function targetChecker(set, coordinates) {
    if (coordinates[0] === undefined) return false;
    let [row, column] = coordinates;
    if (set.has(`${row},${column}`)) {
      return false;
    } else {
      set.add(`${row},${column}`);
      return true;
    }
  }
}
