const flipButton = document.querySelector("#flip");
flipButton.addEventListener("click", (e) => {
  const allShips = document.querySelectorAll(".unit");
  allShips.forEach((unit) => {
    unit.style.flexDirection =
      unit.style.flexDirection === "column" ? "" : "column";
  });
});
