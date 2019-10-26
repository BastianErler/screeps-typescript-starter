import roleBuilder from "roles/builder";
import roleHarvester from "roles/harvester";
import roleUpgrader from "roles/upgrader";
import { ErrorMapper } from "utils/ErrorMapper";
import findNextConstructionSite from "./findNextConstructionSite";
import spawnNewCreep from "./spawnNewCreep";
import { MyCreep, MyGame, MyRoom } from "./types";
import drawCircleOnPosition from "./utils/drawCircleOnPosition";

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

  for (const name in Game.rooms) {
    roomName = name;
    const room: MyRoom = Game.rooms[roomName];
    if (Math.round(Game.time / 1000) * 1000 === Game.time) {
      console.log(`${Math.round(Game.time / 1000) * 1000} = ${Game.time} deleting potentialRoads`);
      if (room.memory.potentialRoads) {
        room.memory.potentialRoads = room.memory.potentialRoads.filter((potPos) => {
          return potPos.passingCount > 25;
        });
        room.memory.potentialRoads.forEach((potPos) => {
          potPos.passingCount = potPos.passingCount / 2;
        });
      }
    }
    const roomController = room.controller;
    for (const creepName in Game.creeps) {
      const creep: MyCreep = Game.creeps[creepName];
      if (creep.memory.role === "harvester") {
        creepsConfig.harvester.current++;
        roleHarvester.run(creep);
        roleHarvester.writePos(creep, room);
      }
      if (creep.memory.role === "upgrader") {
        creepsConfig.upgrader.current++;
        roleUpgrader.run(creep);
        roleUpgrader.writePos(creep, room);
      }
      if (creep.memory.role === "builder") {
        creepsConfig.builder.current++;
        roleBuilder.run(creep);
        roleBuilder.writePos(creep, room);
      }
    }

    if (room.memory.potentialRoads) {
      room.memory.potentialRoads.forEach((potRoad) => {
        drawCircleOnPosition(potRoad.position, potRoad.passingCount.toString());
      });
    }

    if (Game.rooms[roomName].energyCapacityAvailable === Game.rooms[roomName].energyAvailable) {
      if (creepsConfig.harvester.current < creepsConfig.harvester.wanted) {
        console.log("need new Harvester");
        spawnNewCreep("harvester", roomName);
      } else if (creepsConfig.upgrader.current < creepsConfig.upgrader.wanted) {
        console.log("need new Upgrader");
        spawnNewCreep("upgrader", roomName);
      } else if (creepsConfig.builder.current < creepsConfig.builder.wanted && Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
        console.log("need new Builder");
        spawnNewCreep("builder", roomName);
      } else if (creepsConfig.builder.current < 3) {
        spawnNewCreep("upgrader", roomName);
      }
    }
    if (room.find(FIND_MY_CONSTRUCTION_SITES).length === 0 && roomController && roomController.level > 1) {
      const nextRoad = findNextConstructionSite.road(room);
      if (nextRoad && nextRoad.passingCount > 25) {
        console.log(`try to build new road at x:${nextRoad.position.x} y: ${nextRoad.position.y}`);
        const res = room.createConstructionSite(nextRoad.position.x, nextRoad.position.y, STRUCTURE_ROAD);
        if (res !== 0) {
          console.log(`could not build road errorCode: ${res}`);
        }
      } else {
        const nextExpPos = findNextConstructionSite.structureExtension(room);
        if (nextExpPos) {
          room.createConstructionSite(nextExpPos, STRUCTURE_EXTENSION);
        }
      }
    }
  }
});
