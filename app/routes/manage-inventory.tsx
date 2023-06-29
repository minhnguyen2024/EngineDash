//Manage inventory: add/delete and engine
import { US_AVAILABLE_STATE, APPLICATIONS } from "~/utils/helper-data";
import { db } from "~/utils/db.server";
import { type ActionArgs, redirect } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  const newInventoryForm = await request.formData();
  const state = newInventoryForm.get("state");
  const quantity = newInventoryForm.get("quantity");
  const name = newInventoryForm.get("name");
  const application = newInventoryForm.get("application");
  const displacement = newInventoryForm.get("displacement");
  const power = newInventoryForm.get("power");

  if (
    typeof name !== "string" ||
    typeof application !== "string" ||
    typeof displacement !== "string" ||
    typeof power !== "string" ||
    typeof state !== "string" ||
    typeof quantity !== "string"
  ) {
    if (name === "" || application === "" || displacement === "" || power === "" || state === "" || quantity === ""){
      throw new Error("Please enter all data fields")
    }
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
    <div className="flex flex-col justify-center items-center">
      <div className="inline-block">
        <h1 className="text-3xl underline font-bold p-6">
          Add New Inventory Record
        </h1>
      </div>
      <div className="inline-block">
        <form
          method="post"
          className="rounded-md border-2 border-black w-96 ml-6"
        >
          <div className="inline-block ml-8">
            <label>State: </label>
            <select
              name="state"
              id="state"
              className="flex-1 rounded-md border-2 border-black leading-loose"
            >
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
          <ul className="p-8">
            <li className="p-4">
              <label>
                Name:
              </label>
                <input type="text" name="name" id="name" className="rounded-md border-2 border-black"/>
            </li>
            <li className="p-4">
              <label>
                Displacement:
                <input type="text" name="displacement" id="displacement" className="rounded-md border-2 border-black"/>{" "}
                Liters
              </label>
            </li>
            <li className="p-4">
              <label>
                Application:
                <select name="application" id="application" className="rounded-md border-2 border-black">
                  {APPLICATIONS.map((app) => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </label>
            </li>
            <li className="p-4">
              <label>
                Power:
                <input type="text" name="power" id="power" className="rounded-md border-2 border-black"/> HP
              </label>
            </li>
          </ul>
          <div className="justify-center items-center">
            <button type="submit" className="rounded-md border-2 border-black">Add new Inventory</button>
          </div>
        </form>
      </div>
    </div>
  );
}
