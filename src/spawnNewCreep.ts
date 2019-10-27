const getBluePrint = (energyAvailable: number): BodyPartConstant[] => {
  const workPartsCount = Math.round(energyAvailable * 0.5 / 100);
  const energyAvailableAfterWorkParts = energyAvailable - workPartsCount * 100;
  const movePartsCount = Math.round(energyAvailableAfterWorkParts * 1.2 / 100);
  const energyAvailableAfterCarryParts = energyAvailableAfterWorkParts - movePartsCount * 50;
  const carryPartsCount = Math.floor(energyAvailableAfterCarryParts / 50);
  const bodyParts: BodyPartConstant[] = [];
  console.log(workPartsCount, carryPartsCount, movePartsCount);
  pushPartTimes(bodyParts, WORK, workPartsCount);
  pushPartTimes(bodyParts, CARRY, carryPartsCount);
  pushPartTimes(bodyParts, MOVE, movePartsCount);
  console.log(bodyParts);
  return bodyParts;
};

const pushPartTimes = (bodyParts: BodyPartConstant[], part: BodyPartConstant, times: number) => {
  for (let i = 0; i < times; i++) {
    bodyParts.push(part);
  }
};

export default (role: string, roomName: string, energy: number) => {
  for (const spawn in Game.spawns) {
    const result = Game.spawns[spawn].spawnCreep(
      getBluePrint(energy),
      role + Math.round(Math.random() * 1000),
      { memory: { role } }
    );
    if (result !== 0) {
      console.log(`${role} could not be spawned ErrorCode: ${result}`);
    }
  }
};
