import { MyCreep, MyRoom } from "../types";

export default (creep: MyCreep, room: MyRoom) => {
  if (room.memory.potentialRoads === undefined) {
    room.memory.potentialRoads = [];
  }
  const potentialPosition = room.memory.potentialRoads.find(potPos =>
    potPos.position.x === creep.pos.x
    && potPos.position.y === creep.pos.y
    && potPos.position.roomName === creep.pos.roomName
  );
  if (potentialPosition) {
    potentialPosition.passingCount += 1;
  } else {
    room.memory.potentialRoads.push({
      passingCount: 1,
      position: new RoomPosition(creep.pos.x, creep.pos.y, creep.pos.roomName)
    });
  }
}
