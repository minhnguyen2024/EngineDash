//Order Engine: combine Search Engine and Order Engine
//User story: when the user access the Order Engine page, these are the informtion they should know:
//(1) What power, application and displacement (all specifications) of the engine they want
//(2) Where how many do they want to get their engines delivered (state and quantity) (US_AVAILABLE_STATE)
// Then, make a query of to find all available engines that satisfy the (1) criterias
// Use the (2) criteria to funnel data to Dijkstra to find nearest available state
//TODO:
//TODO:
import { US_AVAILABLE_STATE, US_MAP } from "~/utils/helper-data";
import { useActionData, useLoaderData } from "@remix-run/react";
import { type LoaderArgs, type ActionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { dijkstra, printInfo } from "~/utils/engine-dash-algo";

export async function loader({ request }: LoaderArgs) {
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
  return orderEngine(formData)
}

async function orderEngine(formData: any){
  const state = formData.get("state");
  const quantity = formData.get("quantity");
  const application = formData.get("application");
  const displacement = formData.get("displacement");
  const power = formData.get("power");
  
  if (
    typeof application !== "string" ||
    typeof displacement !== "string" ||
    typeof power !== "string" ||
    typeof state !== "string" ||
    typeof quantity !== "string"
  ) {
    if (
      application === "" ||
      displacement === "" ||
      power === "" ||
      state === "" ||
      quantity === ""
    ) {
      throw new Error("Please enter all data fields");
    }
    throw new Error("Form not submitted correctly");
  }
  const resultPayload = dijkstra(US_MAP, US_AVAILABLE_STATE.indexOf(state));
  printInfo(US_AVAILABLE_STATE, resultPayload)
  
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

export default function Order() {
  const availableInventory = useLoaderData<typeof loader>();
  const availableInventoryQueryResult = useActionData<typeof action>() || [];

  // if (!availableInventoryQueryResult) {
  //   throw new Error("Check Engine Availability Failed:(");
  // }

  const displacementList = Array<number>();
  const powerList = Array<number>();
  const applicationList = Array<string>();
  for (let i = 0; i < availableInventory.length; i++) {
    if (
      !displacementList.includes(availableInventory[i].displacement) &&
      !powerList.includes(availableInventory[i].power) &&
      !applicationList.includes(availableInventory[i].application)
    ) {
      displacementList.push(availableInventory[i].displacement);
      powerList.push(availableInventory[i].power);
      applicationList.push(availableInventory[i].application);
    }
  }
  return (
    <div>
      <p>Order Engine</p>
      <form method="post"
        className="rounded-md border-2 border-black w-96 ml-6"
      >
        <input type="hidden" value="ENGINE_AVAILABILITY_QUERY" name="_action"/>
        <ul>
          <li>
            <div className="inline-block ml-8">
              <label>
                Choose your location:
                <select
                  name="state"
                  id="state"
                  className=" rounded-md border-2 border-black"
                >
                  {US_AVAILABLE_STATE.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="inline-block ml-8">
              <label>
                Quantity{" "}
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  className=" rounded-md border-2 border-black"
                ></input>
              </label>
            </div>
          </li>
          <li>
            <label>Choose Engine Specifications</label>
            <ul>
              <li>
                <div className="inline-block ml-8">
                  <label>
                    Power
                    <select
                      name="power"
                      id="power"
                      className=" rounded-md border-2 border-black"
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
                      className=" rounded-md border-2 border-black"
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
                  <label>Displacement</label>
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
          </li>
        </ul>
        <button type="submit" value="SEARCH_ENGINE">Order Engine</button>
      </form>
      

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
                    <td className="py-2 pl-16 ">{engine.name}</td>
                    <td className="py-2 ">{engine.displacement}</td>
                    <td className="py-2 ">{engine.application}</td>
                    <td className="py-2 ">{engine.power}</td>
                    <td className="py-2 pl-16 ">{engine.state.name}</td>
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

//SELECT * FROM db where (power <= {powerLowerBound} AND power >= {powerUpperBound})
// AND application = {application} and quantity >= {quantity}
