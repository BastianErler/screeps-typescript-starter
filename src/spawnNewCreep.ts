import creepsBlueprints from "./config/creepsBlueprints";

export default (role: string, roomName: string) => {
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
