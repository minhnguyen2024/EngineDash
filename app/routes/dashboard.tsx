import { db } from "~/utils/db.server";
import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";


export async function loader({ request }: LoaderArgs) {
  const allEnginesList = await db.engine.findMany({
    include:{
      state: true
    }
  });
  return json(allEnginesList);
}
export default function Dashboard() {
  const inventoryByStateList = useLoaderData<typeof loader>();

  return (
    <div className="">
      <h1 className="text-3xl underline font-bold p-6">Dashboard</h1>
      <table className="mb-4 w-full border-b-2 border-b-gray-200 text-left p-6">
        <thead className="bg-gray-200 font-semibold">
          <tr>
            <th className="py-2 pl-16 ">Engine Name</th>
            <th className="py-2 ">Displacement</th>
            <th className="py-2 ">Application</th>
            <th className="py-2 ">Power</th>
            <th className="py-2 pl-16 ">State</th>
          </tr>
        </thead>
        <tbody>
          
          {inventoryByStateList.map((engine: any) => {
            return (
              <tr key={engine.id}>
                <td className="py-2 pl-16 ">{engine.engineName}</td>
                <td className="py-2 ">{engine.displacement}</td>
                <td className="py-2 ">{engine.application}</td>
                <td className="py-2 ">{engine.power}</td>
                <td className="py-2 pl-16 ">{engine.state.stateName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
