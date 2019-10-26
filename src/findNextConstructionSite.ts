import { Position } from "source-map";

const drawCircleOnPos = (pos: RoomPosition) => {
  new RoomVisual("W1N1").circle(
    pos.x,
    pos.y,
    { fill: "transparent", radius: 0.3, stroke: "#f00" }
  );
};

const extensionCanBeBuildOnPas = (room: Room, pos: RoomPosition) => {
  const posObjects = room.lookAt(pos);
  const terrain = posObjects.find(res => res.type === "terrain");
  const structure = posObjects.find(res => res.type === "structure");
  if (terrain !== undefined) {
    return (terrain.terrain === "swamp" || terrain.terrain === "plain") && structure === undefined;
  }
  return false;
};

export default {
  structureExtension: (room: MyRoom) => {
    if (room.memory.spawnId === undefined) {
      room.memory.spawnId = room.find(FIND_MY_SPAWNS)[0].id;
    }

    const spawn = Game.getObjectById(room.memory.spawnId);
    if (!(spawn instanceof StructureSpawn)) {
      return undefined;
    }

    const spawnPos: RoomPosition = spawn.pos;
    for (let diagonal = 1; diagonal < 10; diagonal++) {
      const startPos: RoomPosition = new RoomPosition(
        spawnPos.x - diagonal,
        spawnPos.y - diagonal,
        spawnPos.roomName
      );
      drawCircleOnPos(startPos);
      if (extensionCanBeBuildOnPas(room, startPos)) {
        return startPos;
      }

      const currentPos = new RoomPosition(
        spawnPos.x - diagonal + 2,
        spawnPos.y - diagonal,
        spawnPos.roomName
      );

      let whileLoopRounds = 0;
      while (!(startPos.x === currentPos.x && startPos.y === currentPos.y) && whileLoopRounds < 10000) {
        whileLoopRounds++;
        drawCircleOnPos(currentPos);
        if (extensionCanBeBuildOnPas(room, currentPos)) {
          return currentPos;
        }

        const maxX = startPos.x + (diagonal * 2);
        const maxY = startPos.y + (diagonal * 2);
        if (maxX > currentPos.x && startPos.y === currentPos.y) {
          currentPos.x += 2;
        } else if (maxX === currentPos.x && maxY > currentPos.y) {
          currentPos.y += 2;
        } else if (maxY === currentPos.y && startPos.x < currentPos.x) {
          currentPos.x -= 2;
        } else {
          currentPos.y -= 2;
        }
      }
    }
    return undefined;
  }
};
