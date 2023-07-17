//Order Engine: combine Search Engine and Order Engine
//User story: when the user access the Order Engine page, these are the informtion they should know:
//(1) What power, application and displacement (all specifications) of the engine they want
//(2) Where how many do they want to get their engines delivered (state and quantity) (US_AVAILABLE_STATE)
// Then, make a query of to find all available engines that satisfy the (1) criterias
// Use the (2) criteria to funnel data to Dijkstra to find nearest available state
//TODO:
//TODO:
import { US_AVAILABLE_STATE, US_DISTANCE_ARRAY } from "~/utils/helper-data";
import { bubbleSort } from "~/utils/helper-functions";
import { useActionData, useLoaderData } from "@remix-run/react";
import { type LoaderArgs, type ActionArgs, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { dijkstra, printInfo } from "~/utils/engine-dash-algo";

export async function loader({ request }: LoaderArgs) {
  console.log("loader")
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
  let { _action } = Object.fromEntries(formData);
  if (_action === "ENGINE_AVAILABILITY_QUERY") {
    return queryEngineAvailabilityUsingDijkstra(formData);
  } else if (_action === "CONFIRM_ENGINE_ORDER") {
    let uuidList: Array<string> = [];
    const result = await queryEngineAvailabilityUsingDijkstra(formData);
    for (const element of result.finalOrder) {
      uuidList.push(element.uuid);
    }
    confirmOrderEngine(uuidList);
    return redirect("/");
  }
}

async function queryEngineAvailabilityUsingDijkstra(formData: FormData) {
  const state = formData.get("state");
  const quantity = formData.get("quantity");
  const application = formData.get("application");
  const displacement = formData.get("displacement");
  const power = formData.get("power");
  const userInput = { state, quantity, application, displacement, power };
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
  const resultPayload = dijkstra(
    US_DISTANCE_ARRAY,
    US_AVAILABLE_STATE.indexOf(state)
  );
  const map = printInfo(US_AVAILABLE_STATE, resultPayload);
  const dist: Array<number> = [...map.values()];
  const sortedDistance = bubbleSort(dist);
  let sortedDistanceState: Array<string> = [];

  sortedDistanceState = Array.from(map.keys()).sort((a, b) => {
    return map.get(a) - map.get(b);
  });

  console.log(sortedDistanceState);
  console.log(sortedDistance);
  let order: Array<any> = [];
  for (let element = 0; element < sortedDistanceState.length; element++) {
    let nextNearestState = sortedDistanceState[element];
    const result: Array<any> = await db.$queryRaw`SELECT * 
    FROM engine e
    INNER JOIN state s on e.stateId = s.id
    WHERE e.displacement = ${displacement} 
    AND e.power = ${power} AND application = ${application} AND s.stateName = ${nextNearestState}`;
    order = order.concat(result);
  }
  let finalOrder: Array<any> = [];
  for (let i = 0; i < parseInt(quantity); i++) {
    finalOrder.push(order[i]);
  }
  return { finalOrder, userInput };
}

async function confirmOrderEngine(uuidList: Array<string>) {
  for (const element of uuidList) {
    await db.$queryRaw`DELETE FROM engine WHERE uuid = ${element}`;
  }
}

export default function Order() {
  const availableInventory = useLoaderData<typeof loader>();
  const availableInventoryQueryResult = useActionData<typeof action>() || {
    finalOrder: [],
    userInput: {},
  };

  if (!availableInventoryQueryResult) {
    throw new Error("Check Engine Availability Failed:(");
  }

  let displacementList = Array<number>();
  let powerList = Array<number>();
  let applicationList = Array<string>();
  displacementList = availableInventory
    .map((item) => item.displacement)
    .filter((value, index, array) => array.indexOf(value) === index);
  powerList = availableInventory
    .map((item) => item.power)
    .filter((value, index, array) => array.indexOf(value) === index);
  applicationList = availableInventory
    .map((item) => item.application)
    .filter((value, index, array) => array.indexOf(value) === index);
  let data: Array<any> = availableInventoryQueryResult.finalOrder || [];
  const input: any = availableInventoryQueryResult.userInput || {};
  data = data.filter((item) => item !== null);
  if (data.length < parseInt(input.quantity)) {
    input.warning = `There are only ${data.length} engines available. Do you want to proceed?`;
  }
  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center">
        <form method="post" className="rounded-md border-2 border-black w-3/4">
          <input
            type="hidden"
            value="ENGINE_AVAILABILITY_QUERY"
            name="_action"
          />
          <div></div>
          <ul className="flex p-4">
            <li className="py-3">
              <div className="ml-8 my-3">
                <label className="mr-3">Choose your location:</label>
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
              </div>
              <div className="ml-8">
                <label className="mr-28">Quantity </label>
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  className=" rounded-md border-2 border-black w-10"
                ></input>
              </div>
            </li>
            <li className="">
              <label className="ml-20 p-3 font-semibold">
                Choose Engine Specifications
              </label>
              <ul>
                <div className="flex">
                  <h1 className="font-extrabold p-6">&gt;&gt;</h1>
                  <div className="mr-8 ml-8">
                    <li>
                      <div className="inline-block mb-3">
                        <label className="mr-14">Power</label>
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
                      </div>
                    </li>
                    <li>
                      <div className="inline-block">
                        <label className="mr-3">Applications</label>
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
                      </div>
                    </li>
                  </div>
                  <h1 className="font-extrabold p-6">&gt;&gt;</h1>
                  <div>
                    <li>
                      <div className="inline-block">
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
                  </div>
                </div>
              </ul>
            </li>
          </ul>
          <div>
            <p className="p-3">
              State: {input.state} &nbsp; Quantity: {input.quantity} &nbsp;
              Application: {input.application} &nbsp; Dispacement:{" "}
              {input.displacement} &nbsp; Power: {input.power}
              {input.warning ? (
                <p className="text-red-600 font-extrabold">
                  Warning: {input.warning}
                </p>
              ) : (
                <p className="text-green-500 font-extrabold">
                  Engines are available
                </p>
              )}
            </p>
          </div>
          <div className="flex items-center justify-center inline-block p-5">
            <button
              type="submit"
              value="SEARCH_ENGINE"
              className="rounded-md border-2 border-black px-4 py-2 bg-blue-500"
            >
              Query Nearest Availability
            </button>
            <h1 className="font-extrabold p-6">&gt;&gt;</h1>
            <p>
              Please reivew the engines' specifications and
              location&#40;State&#41;. <br />
              The engine&#40;s&#41; are choosen based on logistical proximity to
              your location. <br />
              Confirm your order information by RE-ENTERING all information.
            </p>
            <h1 className="font-extrabold p-6">&gt;&gt;</h1>
            <button
              type="submit"
              value="CONFIRM_ENGINE_ORDER"
              name="_action"
              className="rounded-md border-2 border-black px-4 py-2 bg-blue-500"
            >
              Confirm Order
            </button>
          </div>
        </form>
      </div>

      <div>
        {data.length !== 0 ? (
          <table className="mb-4 w-full border-b-2 border-b-gray-200 text-left p-6">
            <thead className="bg-gray-200 font-semibold">
              <tr>
                <th className="py-2 pl-16 ">UUID</th>
                <th className="py-2 pl-16 ">Engine Name</th>
                <th className="py-2 ">Displacement</th>
                <th className="py-2 ">Application</th>
                <th className="py-2 ">Power</th>
                <th className="py-2 pl-16 ">State</th>
              </tr>
            </thead>
            <tbody>
              {data.map((engine: any) => {
                return (
                  <tr key={engine.uuid}>
                    <td className="py-2 pl-16 ">{engine.uuid}</td>
                    <td className="py-2 pl-16 ">{engine.engineName}</td>
                    <td className="py-2 ">{engine.displacement}</td>
                    <td className="py-2 ">{engine.application}</td>
                    <td className="py-2 ">{engine.power}</td>
                    <td className="py-2 pl-16 ">{engine.stateName}</td>
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
