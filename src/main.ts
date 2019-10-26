import creepsBlueprints from "config/creepsBlueprints";
import roleBuilder from "roles/builder";
import roleHarvester from "roles/harvester";
import roleUpgrader from "roles/upgrader";
import { ErrorMapper } from "utils/ErrorMapper";
import findNextConstructionSite from "./findNextConstructionSite";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
declare var Game: MyGame;

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  const creepsConfig = {
    builder: {
      current: 0,
      wanted: 3
    },
    harvester: {
      current: 0,
      wanted: 2
    },
    upgrader: {
      current: 0,
      wanted: 1
    }
  };
  let roomName = "";
  let roomController;
  for (const name in Game.rooms) {
    roomName = name;
    roomController = Game.rooms[roomName].controller;
    for (const creepName in Game.creeps) {
      const creep: MyCreep = Game.creeps[creepName];
      if (creep.memory.role === "harvester") {
        creepsConfig.harvester.current++;
        roleHarvester.run(creep);
      }
      if (creep.memory.role === "upgrader") {
        creepsConfig.upgrader.current++;
        roleUpgrader.run(creep);
      }
      if (creep.memory.role === "builder") {
        creepsConfig.builder.current++;
        roleBuilder.run(creep);
      }
    }
    const spawnNewCreep = (role: string) => {
      for (const spawn in Game.spawns) {
        const result = Game.spawns[spawn].spawnCreep(
          creepsBlueprints.getBluePrint(
            Game.rooms[roomName].energyCapacityAvailable
          ),
          role + Math.round(Math.random() * 1000),
          { memory: { role } }
        );
        if (result !== 0) {
          console.log(`${role} could not be spawned ErrorCode: ${result}`);
        }
      }
    };
    if (Game.rooms[roomName].energyCapacityAvailable === Game.rooms[roomName].energyAvailable) {
      console.log("maxEnergy reached");
      console.log(creepsConfig.harvester.current, creepsConfig.harvester.wanted, "harvester");
      console.log(creepsConfig.upgrader.current, creepsConfig.upgrader.wanted, "upgrader");
      console.log(creepsConfig.builder.current, creepsConfig.builder.wanted, "builder");
      if (creepsConfig.harvester.current < creepsConfig.harvester.wanted) {
        console.log("need new Harvester");
        spawnNewCreep("harvester");
      } else if (creepsConfig.upgrader.current < creepsConfig.upgrader.wanted) {
        console.log("need new Upgrader");
        spawnNewCreep("upgrader");
      } else if (creepsConfig.builder.current < creepsConfig.builder.wanted && Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
        console.log("need new Builder");
        spawnNewCreep("builder");
      } else {
        spawnNewCreep("upgrader");
      }
    }
    if (Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).length === 0 && roomController && roomController.level > 1) {
      const nextExpPos = findNextConstructionSite.structureExtension(Game.rooms[roomName]);
      if (nextExpPos) {
        Game.rooms[roomName].createConstructionSite(nextExpPos, STRUCTURE_EXTENSION);
      }
    }
  }
});
