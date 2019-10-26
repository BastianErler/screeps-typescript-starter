// example declaration file - remove these and add your own custom typings

// memory extension samples

import { Position } from "source-map";

interface MyGame extends Game {
  /**
   * A hash containing all your creeps with creep names as hash keys.
   */
  creeps: { [creepName: string]: MyCreep };
  rooms: { [roomName: string]: MyRoom };
}

interface MyCreep extends Creep {
  memory: MyCreepMemory;
}

interface MyRoomMemory extends RoomMemory {
  spawnId?: string;
  potentialRoads?: PotentialRoad[];
}

interface MyRoom extends Room {
  memory: MyRoomMemory
}

interface PotentialRoad {
  passingCount: number,
  position: RoomPosition,
}

interface MyCreepMemory extends CreepMemory {
  role: string;
  room: string;
  working: boolean;
  lastPosition?: RoomPosition;
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
