import { InventoryItem, JobResponse } from "../types/api";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import Job from "./job/Job";
import InventoryGrid from "./grid/InventoryGrid";

export type InventoryItemData = InventoryItem & { total: number };
export type InventoryDict = Record<string, InventoryItemData>;

function Inventory() {
  const inventories = useLoaderData() as JobResponse | InventoryItem[];

  const handleOnJobEnd = () => {
    window.location.reload();
  };

  if (inventories && "job" in inventories) {
    return <Job job={inventories.job} onEndCb={handleOnJobEnd} />;
  } else {
    const inventoryDict = inventories.reduce<InventoryDict>(
      (acc, inventory) => {
        const latestPrice = Number(
          inventory.Item.Price.at(0)?.medianPrice ?? 0
        );

        acc[inventory.Item.id] = {
          ...inventory,
          total: latestPrice * inventory.count,
        };

        return acc;
      },
      {}
    );

    return (
      <InventoryGrid
        inventoryDict={inventoryDict}
        ids={Object.keys(inventoryDict)}
      />
    );
  }
}

export const fetchInventory = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/inventory/` + params.steamId,
    { signal: request.signal }
  );

  return response.json();
};

export default Inventory;
