import { Navigate } from "react-router-dom";
import React from "react";
import { SimpleLayout, FullLayout } from "../../layout"
import { TableComponent } from "../../pages";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/staff-attendance" replace />
        },
        {
            path: "/staff-attendance",
            layout: FullLayout,
            component: () => <TableComponent />
        }
    ]
}
