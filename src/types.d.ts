// example declaration file - remove these and add your own custom typings

// memory extension samples

interface MyGame extends Game{
  /**
   * A hash containing all your creeps with creep names as hash keys.
   */
  creeps: { [creepName: string]: MyCreep };
}

interface MyCreep extends Creep {
  memory: MyCreepMemory;
}

interface MyRoomMemory extends RoomMemory {
  spawnId?: string;
}

interface MyRoom extends Room {
  memory: MyRoomMemory
}

interface MyCreepMemory extends CreepMemory {
  role: string;
  room: string;
  working: boolean;
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
