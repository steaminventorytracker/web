import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.scss";
import Inventory, { fetchInventory } from "./inventory/Inventory";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    children: [
      {
        path: "inventory/*",
        lazy: () => import("./inventory/InventoryPage") as never,
        children: [
          {
            path: ":steamId",
            element: <Inventory />,
            loader: fetchInventory,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
