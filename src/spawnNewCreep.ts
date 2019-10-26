const getBluePrint = (energyAvailable: number): BodyPartConstant[] => {
  const workPartsCount = Math.round(energyAvailable * 0.5  / 100);
  const energyAvailableAfterWorkParts = energyAvailable - workPartsCount * 100;
  const carryPartsCount = Math.round(energyAvailableAfterWorkParts * 1.2 / 100);
  const energyAvailableAfterCarryParts = energyAvailableAfterWorkParts - carryPartsCount * 50;
  const moveParts = Math.floor(energyAvailableAfterCarryParts / 50);
  const bodyParts: BodyPartConstant[] = [];
  console.log(workPartsCount, carryPartsCount, moveParts);
  pushPartTimes(bodyParts, WORK, workPartsCount);
  pushPartTimes(bodyParts, CARRY, carryPartsCount);
  pushPartTimes(bodyParts, MOVE, moveParts);
  console.log(bodyParts);
  return bodyParts;
};

const pushPartTimes = (bodyParts: BodyPartConstant[], part: BodyPartConstant, times: number) => {
  for (let i = 0; i < times; i++) {
    bodyParts.push(part);
  }
};

export default (role: string, roomName: string) => {
  for (const spawn in Game.spawns) {
    const result = Game.spawns[spawn].spawnCreep(
      getBluePrint(
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
