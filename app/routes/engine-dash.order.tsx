
//Order Engine: combine Search Engine and Order Engine
//User story: when the user access the Order Engine page, these are the informtion they should know:
//(1) What power, application and quantity of the engine they want
//(2) Where do they want to get their engine delivered (US_AVAILABLE_STATE)
// Then, make a query of to find all available engines that satisfy the (1) criterias
// Use the (2) criteria to funnel data to Dijkstra to find nearest available state
//TODO: 
//TODO: 
import { US_AVAILABLE_STATE } from "~/utils/helper-data";
import { useLoaderData } from "@remix-run/react";
import { type ActionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";

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
  const orderForm = await request.formData();
  const state = orderForm.get("state");
  const quantity = orderForm.get("quantity");
  const application = orderForm.get("application");
  const displacement = orderForm.get("displacement");
  const power = orderForm.get("power");

  if (
    typeof application !== "string" ||
    typeof displacement !== "string" ||
    typeof power !== "string" ||
    typeof state !== "string" ||
    typeof quantity !== "string"
  ) {
    if (application === "" || displacement === "" || power === "" || state === "" || quantity === ""){
      throw new Error("Please enter all data fields")
    }
    throw new Error("Form not submitted correctly");
  }

  // console.log({ state, quantity, name, application, displacement, power });
  const queryResult = await db.engine.findMany({
    where:{
      application: application,
      power: parseInt(power),
      displacement: parseFloat(displacement)
    }
  })
  console.log(queryResult)
  return null;
}

export default function Order() {
  const availableInventory = useLoaderData<typeof loader>();
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
      <form
        method="post"
        className="rounded-md border-2 border-black w-96 ml-6"
      >
        <ul>
          <li>
            <div className="inline-block ml-8">
              <label>
                Choose your location:
                <select name="state" id="state" className=" rounded-md border-2 border-black">
                  {US_AVAILABLE_STATE.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
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
                    <select name="power" id="power" className=" rounded-md border-2 border-black">
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
                <div className="inline-block ml-8" >
                  <label>
                    Applications
                    <select name="application" id="application" className=" rounded-md border-2 border-black">
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
                  <select name="displacement" id="displacement" className=" rounded-md border-2 border-black">
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
          <div className="inline-block ml-8">
            <label>
              Quantity <input type="text" name="quantity" id="quantity" className=" rounded-md border-2 border-black"></input>
            </label>
          </div>
        </ul>
        <button type="submit">Order</button>
      </form>
    </div>
  );
}

//SELECT * FROM db where (power <= {powerLowerBound} AND power >= {powerUpperBound})
// AND application = {application} and quantity >= {quantity}

