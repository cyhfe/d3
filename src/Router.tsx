import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout";
import SortAlgorithm from "./routes/sortAlgorithm/SortAlgorithm";
import BarChartRace from "./routes/barChartRace";
import { MidiViz } from "./routes/MidiViz/index";
import BarChart from "./routes/barChart";
import BarChartReact from "./routes/barChartReact";
import BarChartVisx from "./routes/barChartVisx";
import AreaChart from "./routes/areaChart";
import StateOfJs from "./routes/stateOfJs";
import Think from "./routes/think.mdx";

import Home from "./routes/Home.mdx";
import LineAreaArc from "./routes/lineAreaArc";
import Map from "./routes/map";
import Network from "./routes/network";
import Hierarchical from "./routes/hierarchical";

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
        path: "/think",
        element: <Think />,
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
      {
        path: "/bar-chart-react",
        element: <BarChartReact />,
      },
      {
        path: "/bar-chart-visx",
        element: <BarChartVisx />,
      },
      {
        path: "/area-chart",
        element: <AreaChart />,
      },
      {
        path: "/state-of-js",
        element: <StateOfJs />,
      },
      {
        path: "/line-area-arc",
        element: <LineAreaArc />,
      },
      {
        path: "/map",
        element: <Map />,
      },
      {
        path: "/hierarchical",
        element: <Hierarchical />,
      },
      {
        path: "/network",
        element: <Network />,
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
