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
  const inventoryByStateList = await db.state.findMany({
    orderBy: { inventoryLevel: "desc" },
  });
  return json(inventoryByStateList);
}
export default function Dashboard() {
  const inventoryByStateList = useLoaderData<typeof loader>();
  console.log(inventoryByStateList);
  return (
    <div>
      <p>Dashboard</p>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Engine Type</th>
            <th>Inventory Level</th>
          </tr>
        </thead>
        <tbody>
          {inventoryByStateList.map((state: any) => {
            return (
              <tr key={state.id}>
                <td>{state.name}</td>
                <td>{state.engineType}</td>
                <td>{state.inventoryLevel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
