import {
  Links,
  Link,
  LiveReload,
  Outlet,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import stylesheet from './styles/tailwind.css'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]; 

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>EngineDash</title>
        <Links/>
      </head>
      <body>
        <nav className="">
          <ul className="p-6">
            <li className="inline-block mr-4">
                <Link to="dashboard">Dashboard</Link>
            </li>
            <li className="inline-block mr-4">
                <Link to="engine-dash/order">Order Engines</Link>
            </li>
            <li className="inline-block mr-4">
                <Link to="engine-dash/search">Search for Engines</Link>
            </li>
            <li className="inline-block mr-4">
                <Link to="manage-inventory">Manage Inventory</Link>
            </li>
          </ul>
        </nav>
        <Outlet/>
        <LiveReload />
      </body>
    </html>
  );
}


