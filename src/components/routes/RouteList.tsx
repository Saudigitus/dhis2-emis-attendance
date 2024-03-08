import React from "react";
import { Navigate } from "react-router-dom";
import { TableComponent } from "../../pages";
import { SimpleLayout, FullLayout } from "../../layout"

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
