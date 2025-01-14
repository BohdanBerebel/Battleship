import Ship from "../scr/ship";

describe("Test the ship class", () => {
  const ship = new Ship(2);
  test("Create a ship", () => {
    expect(ship).toEqual({ length: 2, sunk: false, timesBeenHit: 0 });
  });
  test("Test being hit", () => {
    ship.hit();
    expect(ship.timesBeenHit).toBe(1);
  });
  test("Test being sunk", () => {
    ship.hit();
    expect(ship.sunk).toBeTruthy();
  });
});
