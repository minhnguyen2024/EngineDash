import {
  Link,
  LiveReload,
  Outlet,
} from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>Remix: So great, it's funny!</title>
      </head>
      <body>
        <nav>
          <ul>
            <li>
                <Link to="dashboard">Dashboard</Link>
            </li>
            <li>
                <Link to="engine-dash/order">Order Engines</Link>
            </li>
            <li>
                <Link to="engine-dash/search">Search for Engines</Link>
            </li>
            <li>
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


