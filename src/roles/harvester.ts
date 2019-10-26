export default {
  run: (creep: MyCreep) => {
    if (creep.memory.working) {
      const targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure: AnyStructure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
      creep.memory.working = creep.carry.energy > 0;
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
      creep.memory.working = (creep.carry.energy === creep.carryCapacity);
    }
  }
};
