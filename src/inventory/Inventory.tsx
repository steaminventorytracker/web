import React, { useCallback, useEffect, useMemo } from "react";
import { InventoryItem, JobResponse } from "../types/api";
import Item, { currencyFormatter } from "./Item";
import { useNavigate, useParams } from "react-router-dom";

export type InventoryItemData = InventoryItem & { total: number };

type Inventories = Record<string, InventoryItemData>;

const handleSortByPrice =
  (priceSort: "asc" | "desc" | null, inventories: Inventories) =>
  (idA: string, idB: string) => {
    const inventoryA = inventories[idA];
    const inventoryB = inventories[idB];

    if (inventoryA.total > inventoryB.total) {
      return priceSort === "asc" ? 1 : -1;
    }
    if (inventoryA.total < inventoryB.total) {
      return priceSort === "asc" ? -1 : 1;
    }

    return 0;
  };

const handleSortByCount =
  (countSort: "asc" | "desc" | null, inventories: Inventories) =>
  (idA: string, idB: string) => {
    const inventoryA = inventories[idA];
    const inventoryB = inventories[idB];

    if (inventoryA.count > inventoryB.count) {
      return countSort === "asc" ? 1 : -1;
    }
    if (inventoryA.count < inventoryB.count) {
      return countSort === "asc" ? -1 : 1;
    }

    return 0;
  };

type SortType = "asc" | "desc" | null;

function Inventory() {
  const [priceSort, setPriceSort] = React.useState<SortType>("desc");
  const [countSort, setCountSort] = React.useState<SortType>(null);
  const [inventories, setInventories] = React.useState<Inventories>({});
  const [ids, setIds] = React.useState<string[]>([]);

  const { steamId } = useParams();
  const navigate = useNavigate();

  const [marketHashName, setMarketHashName] = React.useState<string>("");

  const handleFetchData = useCallback(async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/inventory/` + steamId
    );
    const data = (await response.json()) as InventoryItem[] | JobResponse;

    if ("job" in data) {
      navigate("/job/" + data.job.id, {
        state: { job: data.job, steamId },
      });

      return;
    }

    setInventories(() => {
      return data.reduce<Inventories>((acc, inventory) => {
        const price = inventory.Item.Price.at(0)?.medianPrice ?? 0;

        acc[inventory.Item.id] = {
          ...inventory,
          total: Number(price) * inventory.count,
        };

        return acc;
      }, {});
    });

    setIds(() => data.map((inventory) => inventory.Item.id));
  }, [navigate, steamId]);

  useEffect(() => {
    handleFetchData();
  });

  const renderedIds = useMemo(() => {
    let sortedIds = [...ids];

    if (marketHashName) {
      sortedIds = sortedIds.filter((id) => {
        const inventory = inventories[id];
        const item = inventory.Item;

        return item.marketHashName
          .toUpperCase()
          .includes(marketHashName.toUpperCase());
      });
    }

    if (priceSort)
      sortedIds = sortedIds.sort(handleSortByPrice(priceSort, inventories));
    if (countSort)
      sortedIds = sortedIds.sort(handleSortByCount(countSort, inventories));

    return sortedIds;
  }, [countSort, ids, inventories, marketHashName, priceSort]);

  const renderInventory = useMemo(() => {
    if (!inventories) {
      return <p>Loading...</p>;
    }

    return renderedIds.map((id) => (
      <Item
        key={id}
        inventory={inventories[id]}
        marketHashName={marketHashName}
      />
    ));
  }, [inventories, marketHashName, renderedIds]);

  const inventoryValue = useMemo(() => {
    return ids.reduce((acc, id) => {
      const inventory = inventories[id];
      const item = inventory.Item;
      const price = Number(item.Price?.at(0)?.medianPrice);
      return acc + inventory.count * price;
    }, 0);
  }, [ids, inventories]);

  const handlePriceSortAction = () => {
    switch (priceSort) {
      case "asc":
        setPriceSort(null);
        break;
      case "desc":
        setPriceSort("asc");
        break;
      default:
        setCountSort(null);
        setPriceSort("desc");
    }
  };

  const handleCountSortAction = () => {
    switch (countSort) {
      case "asc":
        setCountSort(null);
        break;
      case "desc":
        setCountSort("asc");
        break;
      default:
        setPriceSort(null);
        setCountSort("desc");
    }
  };

  return (
    <div className={"flex flex-col items-center"}>
      <div>
        <span className={"text-xl dark:text-white"}>
          Total: {currencyFormatter.format(inventoryValue)}
        </span>
      </div>
      <div className={"flex gap-3"}>
        <div>
          <button
            onClick={handlePriceSortAction}
            className={"hover:cursor-pointer dark:text-white"}
          >
            {`Price-Sort (${priceSort ?? ""})`}
          </button>
        </div>
        <div>
          <button
            onClick={handleCountSortAction}
            className={"hover:cursor-pointer dark:text-white"}
          >
            {`Count-Sort (${countSort ?? ""})`}
          </button>
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setMarketHashName(e.target.value)}
          />
        </div>
        <div
          className={"dark:text-white"}
        >{`Rendered items : ${renderedIds.length} / ${ids.length}`}</div>
      </div>
      <div className={"container grid grid-cols-5 gap-4"}>
        {renderInventory}
      </div>
    </div>
  );
}

export default Inventory;
