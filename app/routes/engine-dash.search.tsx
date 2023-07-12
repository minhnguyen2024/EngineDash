import { useActionData, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { type ActionArgs } from "@remix-run/node";

//enigne search: allow search for engine availability
//regardless of state or quantity
//REAL-TIME inventory update: shows availalble enigne
//TODO: loader: fetch real-time inventory data
//TODO: action: create query for engine availability
export async function loader() {
  const availableInventory = await db.engine.findMany({
    select: {
      displacement: true,
      power: true,
      application: true,
      state: true,
    },
  });
  return availableInventory;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  return engineAvailabilityQuery(formData);
}

async function engineAvailabilityQuery(formData: FormData) {
  const application = formData.get("application");
  const displacement = formData.get("displacement");
  const power = formData.get("power");

  if (
    typeof application !== "string" ||
    typeof displacement !== "string" ||
    typeof power !== "string"
  ) {
    if (application === "" || displacement === "" || power === "") {
      throw new Error("Please enter all data fields");
    }
    throw new Error("Form not submitted correctly");
  }

  const queryResult = await db.engine.findMany({
    where: {
      application: application,
      power: parseInt(power),
      displacement: parseFloat(displacement),
    },
    include: {
      state: true,
    },
  });
  return queryResult;
}
export default function EngineSearch() {
  const availableInventory = useLoaderData<typeof loader>();
  const availableInventoryQueryResult = useActionData<typeof action>() || [];

  let displacementList: number[];
  let powerList: number[];
  let applicationList: string[];
  displacementList = availableInventory
    .map((item) => item.displacement)
    .filter((value, index, array) => array.indexOf(value) === index);
  powerList = availableInventory
    .map((item) => item.power)
    .filter((value, index, array) => array.indexOf(value) === index);
  applicationList = availableInventory
    .map((item) => item.application)
    .filter((value, index, array) => array.indexOf(value) === index);
  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center">
        <form
          method="post"
          className="rounded-md border-2 border-black ml-6"
        >
          <input
            type="hidden"
            value="ENGINE_AVAILABILITY_QUERY"
            name="_action"
          />
          <div className="flex items-center justify-center">
            <label className="font-semibold">Choose Engine Specifications</label>
          </div>
            <ul className="flex p-4">
              <li>
                <div className="inline-block ml-8">
                  <label >
                    Power
                    <select
                      name="power"
                      id="power"
                      className=" rounded-md border-2 border-black ml-3"
                    >
                      {powerList.map((power) => (
                        <option key={power} value={power}>
                          {power} HP
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
              <li>
                <div className="inline-block ml-8">
                  <label>
                    Applications
                    <select
                      name="application"
                      id="application"
                      className=" rounded-md border-2 border-black ml-3"
                    >
                      {applicationList.map((app) => (
                        <option key={app} value={app}>
                          {app}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
              <li>
                <div className="inline-block ml-8">
                  <label className="mr-3">Displacement</label>
                  <select
                    name="displacement"
                    id="displacement"
                    className=" rounded-md border-2 border-black"
                  >
                    {displacementList.map((dis) => (
                      <option key={dis} value={dis}>
                        {dis}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            </ul>
          <div className="flex items-center justify-center inline-block pb-3">
            <button
              type="submit"
              className="rounded-md border-2 border-black px-4 py-2 bg-blue-500"
            >
              Search For Engine
            </button>
          </div>
        </form>
      </div>
      <div>
        {availableInventory.length !== 0 ? (
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
              {availableInventoryQueryResult.map((engine: any) => {
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
        ) : (
          <p>No Available Engines Found</p>
        )}
      </div>
    </div>
  );
}
