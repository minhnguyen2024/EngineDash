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
    if (
      name === "" ||
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

  const stateObjFromQuery = await db.state.findUnique({
    where: {
      stateName: state,
    },
  });
  if (!stateObjFromQuery) {
    throw new Error("State is unavailable");
  }
  for (let i = 0; i < parseInt(quantity); i++) {
    await db.engine.create({
      data: {
        engineName: name,
        displacement: parseFloat(displacement),
        application: application,
        power: parseInt(power),
        stateId: stateObjFromQuery.id,
      },
    });
  }
  return redirect("/");
}
export default function ManageInventory() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="">
        <h1 className="text-3xl underline font-bold p-6">
          Add New Inventory Record
        </h1>
      </div>
      <div className="">
        <form method="post" className="rounded-md border-2 border-black">
          <div className="flex">
            <div className="mt-6 inline-block p-2">
              <div className="">
                <ul>
                  <div>
                    <li className="p-4">
                      <div className="inline-block ml-8">

                      <label className="mr-4">State</label>
                      <select
                        name="state"
                        id="state"
                        className="flex-1 rounded-md border-2 border-black leading-loose w-14"
                      >
                        {US_AVAILABLE_STATE.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      </div>
                    </li>
                  </div>
                  <div>
                    <li className="p-4">
                    <div className="inline-block ml-8">

                      <label className="mr-3">Quantity</label>
                      <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        className="flex-1 rounded-md border-2 border-black w-8"/>
                    </div>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <div className="inline-block">
              <ul className="p-8">
                <div className="flex">
                  <li className="p-4">
                    <label className="mr-3">Name:</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="rounded-md border-2 border-black w-36"
                    />
                  </li>
                  <li className="p-4">
                    <label> Displacement: </label>
                    <input
                      type="text"
                      name="displacement"
                      id="displacement"
                      className="rounded-md border-2 border-black w-8"
                    />{" "}
                  </li>
                </div>
                <div className="flex">
                  <li className="p-4">
                    <label className="mr-3">
                      Application:
                    </label>
                      <select
                        name="application"
                        id="application"
                        className="rounded-md border-2 border-black"
                      >
                        {APPLICATIONS.map((app) => (
                          <option key={app} value={app}>
                            {app}
                          </option>
                        ))}
                      </select>
                  </li>
                  <li className="p-4">
                    <label className="mr-3">
                      Power:
                    </label>
                      <input
                        type="text"
                        name="power"
                        id="power"
                        className="rounded-md border-2 border-black w-20"
                      />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center inline-block pb-3">
            <button
              type="submit"
              className="rounded-md border-2 border-black px-4 py-2 bg-blue-500"
            >
              Add new Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
