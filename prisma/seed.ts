import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()

async function seed(){
    await Promise.all(
        getStates().map(state => {
            // const data = {
            //     name: state.name,
            //     engineType: state.engineType,
            //     inventoryLevel: state.inventoryLevel
            // }
            return db.state.create({data: state})
        })
    )
}
seed()
function getStates(){
    return [
        {
            name: "IN",
            engineType: "Type-1",
            inventoryLevel: 20
        },
        {
            name: "PA",
            engineType: "Type-1",
            inventoryLevel: 19
        },
        {
            name: "MI",
            engineType: "Type-1",
            inventoryLevel: 27
        }
    ]
}