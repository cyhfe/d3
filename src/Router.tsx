import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Layout from "./Layout";
import SortAlgorithm from "./routes/SortAlgorithm";
import BarChartRace from "./routes/barChartRace";
import StateOfJs from "./routes/stateOfJs";

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
        path: "/state-of-js",
        element: <StateOfJs />,
      },
      {
        path: "/sort-algorithm",
        element: <SortAlgorithm />,
      },
      {
        path: "/bar-chart-race",
        element: <BarChartRace />,
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
