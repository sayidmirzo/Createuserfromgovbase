import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { EmployeesList } from "./components/EmployeesList";
import { EmployeeProfile } from "./components/EmployeeProfile";
import { EmployeeCreate } from "./components/EmployeeCreate";
import { Settings } from "./components/Settings";
import { BulkImport } from "./components/BulkImport";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: EmployeesList },
      { path: "employee/:id", Component: EmployeeProfile },
      { path: "employee/create", Component: EmployeeCreate },
      { path: "settings", Component: Settings },
      { path: "bulk-import", Component: BulkImport },
      { path: "*", Component: EmployeesList }, // Catch-all route - redirect to home
    ],
  },
]);