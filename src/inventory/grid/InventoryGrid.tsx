import React, { PropsWithoutRef, useEffect, useMemo } from "react";
import Item, { currencyFormatter } from "../Item";
import { InventoryDict } from "../Inventory";
import ActionButton from "./ActionButton";
import { TagProps } from "./Tag";
import { Item as ItemType } from "../../types/api";

export type TagType = {
  style: TagProps["style"];
  title: string;
};

export const tags: { key: keyof ItemType; tag: TagType }[] = [
  {
    key: "isSouvenir",
    tag: { style: "yellow", title: "Souvenir" },
  },
  {
    key: "isStattrak",
    tag: { style: "orange", title: "StackTrack" },
  },
];

const handleSortByPrice =
  (priceSort: "asc" | "desc" | null, inventories: InventoryDict) =>
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
  (countSort: "asc" | "desc" | null, inventories: InventoryDict) =>
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

type InventoryGridProps = {
  inventoryDict: InventoryDict;
  ids: string[];
};

function InventoryGrid({
  inventoryDict,
  ids,
}: PropsWithoutRef<InventoryGridProps>) {
  const [priceSort, setPriceSort] = React.useState<SortType>("desc");
  const [countSort, setCountSort] = React.useState<SortType>(null);
  const [marketHashName, setMarketHashName] = React.useState<string>("");
  const [selectedTag, setSelectedTag] = React.useState<keyof ItemType | null>(
    null
  );

  const renderedIds = useMemo(() => {
    let sortedIds = [...ids];

    if (selectedTag) {
      sortedIds = sortedIds.filter((id) => {
        const inventory = inventoryDict[id];
        const item = inventory.Item;

        return item[selectedTag];
      });
    }

    if (marketHashName) {
      sortedIds = sortedIds.filter((id) => {
        const inventory = inventoryDict[id];
        const item = inventory.Item;

        return item.marketHashName
          .toUpperCase()
          .includes(marketHashName.toUpperCase());
      });
    }

    if (priceSort)
      sortedIds = sortedIds.sort(handleSortByPrice(priceSort, inventoryDict));
    if (countSort)
      sortedIds = sortedIds.sort(handleSortByCount(countSort, inventoryDict));

    return sortedIds;
  }, [countSort, ids, inventoryDict, marketHashName, priceSort, selectedTag]);

  const renderInventory = useMemo(() => {
    if (!inventoryDict) {
      return <p>Loading...</p>;
    }

    return renderedIds.map((id) => (
      <Item
        key={id}
        inventory={inventoryDict[id]}
        marketHashName={marketHashName}
      />
    ));
  }, [inventoryDict, marketHashName, renderedIds]);

  const inventoryValue = useMemo(() => {
    return ids.reduce((acc, id) => {
      const inventory = inventoryDict[id];
      const item = inventory.Item;
      const price = Number(item.Price?.at(0)?.medianPrice);
      return acc + inventory.count * price;
    }, 0);
  }, [ids, inventoryDict]);

  useEffect(() => {
    console.log({
      priceSort,
      countSort,
      marketHashName,
    });
  }, [countSort, priceSort, marketHashName]);

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

  if (!inventoryDict) {
    return <p>Loading...</p>;
  }

  return (
    <div className={"flex flex-col items-center gap-5"}>
      <div className={"flex"}>
        <span className={"text-xl dark:text-white"}>
          Total: {currencyFormatter.format(inventoryValue)}
        </span>
      </div>
      <div
        className={
          "flex w-full items-center gap-3 rounded-md p-3 dark:bg-slate-800"
        }
      >
        <div>
          <input
            type="text"
            onChange={(e) => setMarketHashName(e.target.value)}
            className={"rounded-md p-2 dark:bg-slate-900 dark:text-white"}
          />
        </div>
        <ActionButton onClick={handlePriceSortAction}>
          {`Price-Sort (${priceSort ?? ""})`}
        </ActionButton>
        <ActionButton onClick={handleCountSortAction}>
          {`Count-Sort (${countSort ?? ""})`}
        </ActionButton>
        <div>
          <select
            name="tag"
            id="tag"
            onChange={(e) => setSelectedTag(e.target.value as keyof ItemType)}
            className={"rounded-md p-2 dark:bg-slate-900 dark:text-white"}
          >
            <option value="">Choose a tag</option>
            {tags.map(({ key, tag }) => {
              return (
                <option selected={selectedTag === key} key={key} value={key}>
                  {tag.title}
                </option>
              );
            })}
          </select>
        </div>
        <div
          className={"ml-auto dark:text-white"}
        >{`Rendered items : ${renderedIds.length} / ${ids.length}`}</div>
      </div>
      <div className={"grid w-full grid-cols-5 gap-6"}>{renderInventory}</div>
    </div>
  );
}

export default InventoryGrid;
