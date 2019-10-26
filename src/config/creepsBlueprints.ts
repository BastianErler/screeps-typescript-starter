const config = [
  {
    bluePrint: [WORK, WORK, CARRY, MOVE],
    energyNeeded: 300
  },
  {
    bluePrint: [WORK, WORK, CARRY, MOVE, MOVE],
    energyNeeded: 350
  },
  {
    bluePrint: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    energyNeeded: 400
  },
  {
    bluePrint: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    energyNeeded: 450
  },
  {
    bluePrint: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    energyNeeded: 500
  },
  {
    bluePrint: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    energyNeeded: 550
  }
];
export default {
  getBluePrint: (energyAvailable: number): BodyPartConstant[] => {
    const bluePrintConfig = config.find(o => o.energyNeeded === energyAvailable);
    return bluePrintConfig ? bluePrintConfig.bluePrint : [WORK, WORK, CARRY, MOVE];
  }
};
