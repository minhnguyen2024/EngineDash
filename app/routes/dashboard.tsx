import { db } from "~/utils/db.server";
import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type State = {
  id: string;
  name: string;
  engineType: string;
  inventoryLevel: string;
};

export async function loader({ request }: LoaderArgs) {
  const allEnginesList = await db.engine.findMany({
    include:{
      state: true
    }
  });
  const listByState = await db.state.findMany({
    include: {
      engines: true,
    },
  });
  return json(allEnginesList);
}
export default function Dashboard() {
  const inventoryByStateList = useLoaderData<typeof loader>();
  // console.log(inventoryByStateList);
  // inventoryByStateList.map(state =>{
  //   console.log(state.name)
  //   console.log(state.engines)
  //   console.log("--------------------")
  // })
  return (
    <div>
      <p>Dashboard</p>
      <table>
        <thead>
          <tr>
            <th>Engine Name</th>
            <th>Displacement</th>
            <th>Application</th>
            <th>Power</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          
          {inventoryByStateList.map((engine: any) => {
            return (
              <tr key={engine.id}>
                <td>{engine.name}</td>
                <td>{engine.displacement}</td>
                <td>{engine.application}</td>
                <td>{engine.power}</td>
                <td>{engine.state.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// {inventoryByStateList.map((state: any) => {
//   return (
//     <tr key={state.engines.id}>
//       <td>{state.engines.name}</td>
//       <td>{state.engines.displacement}</td>
//       <td>{state.engines.application}</td>
//       <td>{state.engines.power}</td>
//     </tr>
//   );
