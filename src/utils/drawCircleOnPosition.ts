export default (pos: RoomPosition, text?: string) => {
  new RoomVisual().circle(
    pos.x,
    pos.y,
    { fill: "transparent", radius: 0.3, stroke: "#f00" }
  );
  if (text) {
    new RoomVisual().text(text, pos.x, pos.y, { font: 0.3 });
  }
};
