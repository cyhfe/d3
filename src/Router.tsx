import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import NiceTry from "./routes/niceTry";

import Layout from "./Layout";
import SortAlgorithm from "./routes/SortAlgorithm";
import BarChartRace from "./routes/barChartRace";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/sort-algorithm" />,
      },
      {
        path: "/sort-algorithm",
        element: <SortAlgorithm />,
      },
      {
        path: "/bar-chart-race",
        element: <BarChartRace />,
      },
      {
        path: "/nice-try",
        element: <NiceTry />,
      },
    ],
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
