//SELECT * FROM db where (power <= {powerLowerBound} AND power >= {powerUpperBound})
// AND application = {application} and quantity >= {quantity}
import { US_STATES } from "~/utils/helper-data";
import { useLoaderData } from "@remix-run/react";
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
      <form method="post">
        <ul>
          <li>
            <label>
              Choose your location:
              <select name="state" id="state">
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>
          </li>
          <li>
            <label>Choose Engine Specifications</label>
            <ul>
              <li>
                <label>
                  Power
                  <select name="power" id="power">
                    {powerList.map((power) => (
                      <option key={power} value={power}>
                        {power} Liters
                      </option>
                    ))}
                  </select>
                </label>
              </li>
              <li>
                <label>
                  Applications
                  <select name="application" id="application">
                    {applicationList.map((app) => (
                      <option key={app} value={app}>
                        {app}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
              <li>
                Displacement
                <select name="displacement" id="displacement">
                  {displacementList.map((dis) => (
                    <option key={dis} value={dis}>
                      {dis}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
          </li>
          <label>
            Quantity <input type="text" name="quantity" id="quantity"></input>
          </label>
        </ul>
      </form>
    </div>
  );
}
