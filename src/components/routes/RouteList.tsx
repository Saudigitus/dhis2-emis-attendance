import { Navigate } from "react-router-dom";
import React from "react";
import { SimpleLayout, FullLayout } from "../../layout"
import { TableComponent } from "../../pages";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/attendance" replace />
        },
        {
            path: "/attendance",
            layout: FullLayout,
            component: () => <TableComponent />
        }
    ]
}
