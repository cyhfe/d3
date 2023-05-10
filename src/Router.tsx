import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Layout from "./Layout";
import SortAlgorithm from "./routes/SortAlgorithm";
import BarChartRace from "./routes/barChartRace";
import { MidiViz } from "./routes/MidiViz/index";
import BarChart from "./routes/barChart";

import Home from "./routes/Home.mdx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/midi-viz",
        element: <MidiViz />,
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
        path: "/bar-chart",
        element: <BarChart />,
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
