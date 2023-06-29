//Manage inventory: add/delete and engine
import { US_AVAILABLE_STATE } from "~/utils/helper-data";
import { APPLICATIONS } from "~/utils/helper-data";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { type ActionArgs, redirect } from "@remix-run/node";

import { Form } from "@remix-run/react";

export async function action({ request }: ActionArgs) {
  const newInventoryForm = await request.formData();
  const state = newInventoryForm.get("state");
  const quantity = newInventoryForm.get("quantity");
  const name = newInventoryForm.get("name");
  const application = newInventoryForm.get("application");
  const displacement = newInventoryForm.get("displacement");
  const power = newInventoryForm.get("power");
  //TODO: validate above data
  if (
    typeof name !== "string" ||
    typeof application !== "string" ||
    typeof displacement !== "string" ||
    typeof power !== "string" ||
    typeof state !== "string" ||
    typeof quantity !== "string"
  ) {
    throw new Error("Form not submitted correctly");
  }
  const stateObjFromQuery = await db.state.findUnique({
    where: {
      name: state,
    },
  });
  if (!stateObjFromQuery) {
    throw new Error("State is unavailable");
  }
  for (let i = 0; i < parseInt(quantity); i++) {
    await db.engine.create({
      data: {
        name: name,
        displacement: parseFloat(displacement),
        application: application,
        power: parseInt(power),
        stateId: stateObjFromQuery.id,
      },
    });
  }
  return redirect("/dashboard");
}
export default function ManageInventory() {
  return (
    <div className="flex justify-center items-center">
      <div>
      <h1 className="text-3xl underline font-bold p-6">
        Add New Inventory Record
      </h1>
      </div>
      <div>

      <form method="post" className="rounded-md border-2 border-black w-96 ml-6">
        <div className="inline-block ml-8">
          <label>State: </label>
          <select name="state" id="state" className="flex-1 rounded-md border-2 border-black leading-loose">
            {US_AVAILABLE_STATE.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="inline-block ml-8">
          <label>Quantity</label>
          <input
            type="text"
            name="quantity"
            id="quantity"
            className="flex-1 rounded-md border-2 border-black w-8"
          ></input>
        </div>
        <ul>
          <li>
            <label>
              Name:
              <input type="text" name="name" id="name" /> Liters
            </label>
          </li>
          <li>
            <label>
              Displacement:
              <input type="text" name="displacement" id="displacement" /> Liters
            </label>
          </li>
          <li>
            <label>
              Application:
              <select name="application" id="application">
                {APPLICATIONS.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </label>
          </li>
          <li>
            <label>
              Power:
              <input type="text" name="power" id="power" /> HP
            </label>
          </li>
        </ul>
        <button type="submit">Add new Inventory</button>
      </form>
      </div>
    </div>
  );
}
