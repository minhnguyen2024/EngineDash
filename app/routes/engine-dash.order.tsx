//SELECT * FROM db where (power <= {powerLowerBound} AND power >= {powerUpperBound})
// AND application = {application} and quantity >= {quantity}
import { US_STATES } from "~/utils/US_STATES";
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
  for (let i = 0; i < availableInventory.length; i++) {
    if (!displacementList.includes(availableInventory[i].displacement)) {
      displacementList.push(availableInventory[i].displacement);
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
                  <select name="select-engine-type" id="select-engine-type">
                    <option value="power">2 Liters</option>
                  </select>
                </label>
              </li>
              <li>
                <label>
                  Applications
                  <select
                    name="select-engine-application"
                    id="select-engine-application"
                  >
                    <option value="agriculture">Agriculture</option>
                    <option value="construction">Construction</option>
                    <option value="mining">Mining</option>
                    <option value="marine">Marine</option>
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
            Quantity <input type="text"></input>
          </label>
        </ul>
      </form>
    </div>
  );
}
