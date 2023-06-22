import { Outlet } from "@remix-run/react";

export default function EngineDash(){
    return <div>
        <p>This is Engine Dash</p>
        <Outlet/>
    </div>
}