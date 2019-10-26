import { MyCreep, MyRoom } from "../types";

const posEqual = (pos1: RoomPosition, pos2: RoomPosition) => {
  return pos1.x === pos2.x && pos1.y === pos2.y && pos1.roomName === pos2.roomName;
};

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
    if (creep.memory.lastPosition && !posEqual(creep.pos, creep.memory.lastPosition)) {
      potentialPosition.passingCount += 1;
    }
  } else {
    room.memory.potentialRoads.push({
      passingCount: 1,
      position: creep.pos
    });
  }
  creep.memory.lastPosition = creep.pos;
}
