export default function build(user) {
  const player = document.querySelector(`#${user}`);

  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 10; j++) {
      const column = document.createElement("div");
      column.row = i;
      column.column = j;
      column.classList.add("cell");
      row.appendChild(column);
    }
    player.appendChild(row);
  }
}
