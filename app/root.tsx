import {
  Links,
  Link,
  LiveReload,
  Outlet,
  useLocation
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useState, useEffect } from "react";


import stylesheet from './styles/tailwind.css'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]; 

export default function App() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

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
        <nav className=" bg-red-600 text-white font-semibold">
          <ul className="p-6">
            <li className="inline-block mr-4 hover:underline">
                <Link to="/" className={location.pathname === '/' ? 'underline font-extrabold' : ''}>Dashboard</Link>
            </li>
            <li className="inline-block mr-4 hover:underline">
                <Link to="engine-dash/order" className={location.pathname === '/engine-dash/order' ? 'underline font-extrabold' : ''}>Order Engines</Link>
            </li>
            <li className="inline-block mr-4 hover:underline">
                <Link to="engine-dash/search" className={location.pathname === '/engine-dash/search' ? 'underline font-extrabold' : ''}>Search for Engines</Link>
            </li>
            <li className="inline-block mr-4 hover:underline">
                <Link to="manage-inventory" className={location.pathname === '/manage-inventory' ? 'underline font-extrabold' : ''}>Manage Inventory</Link>
            </li>
          </ul>
        </nav>
        <Outlet/>
        <LiveReload />
      </body>
    </html>
  );
}


