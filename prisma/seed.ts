import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const indiana = await db.state.create({
    data: { name: "MI" },
  });
  await Promise.all(
    seedEnigines().map((engine) => {
      const data = { stateId: indiana.id, ...engine };
      return db.engine.create({data})
    })
  );
}
seed();
function seedStates() {
  return [
    {
      name: "PA",
    },
    {
      name: "MI",
    },
  ];
}

function seedEnigines() {
  return [
    {
      name: "X15 (Stage V)",
      displacement: 14.9,
      application: "Agriculture",
      power: 450,
    },
    {
      name: "X15 (Stage V)",
      displacement: 14.9,
      application: "Agriculture",
      power: 450,
    },
    // {
    //   name: "QSK50",
    //   displacement: 50,
    //   application: "Marine",
    //   power: 1400,
    // },
    {
      name: "X15 (Stage V)",
      displacement: 14.9,
      application: "Agriculture",
      power: 450,
    },
    // {
    //   name: "QSK95",
    //   displacement: 95,
    //   application: "Mining",
    //   power: 3600,
    // },
  ];
}
