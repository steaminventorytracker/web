import React, { useMemo } from "react";
import { InventoryItemData } from "./Inventory";
import Tag from "./grid/Tag";
import { tags } from "./grid/InventoryGrid";
import { Item as ItemType, ItemTypeType, ItemWear } from "../types/api";

type ItemProps = {
  inventory: InventoryItemData;
  marketHashName: string | null;
  setSelectedTag: React.Dispatch<React.SetStateAction<keyof ItemType | "">>;
  setSelectedType: React.Dispatch<React.SetStateAction<ItemTypeType | "">>;
  setSelectedWear: React.Dispatch<React.SetStateAction<ItemWear | "">>;
};

const highLight = (text: string, query: string | null) => {
  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === query?.toLowerCase()
              ? "bg-yellow-300 text-black"
              : ""
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

export const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  currency: "CAD",
});

function Item({
  inventory,
  marketHashName,
  setSelectedTag,
  setSelectedType,
  setSelectedWear,
}: React.PropsWithoutRef<ItemProps>) {
  const item = inventory.Item;
  const price = item.Price.at(0)?.medianPrice;
  const formattedPrice = price ? currencyFormatter.format(Number(price)) : null;
  const totalFormattedPrice = inventory.total
    ? currencyFormatter.format(inventory.total)
    : null;

  const priceData = useMemo(() => {
    if (!price) return null;

    return (
      <div
        className={
          "flex h-12 flex-col items-center justify-center dark:text-white"
        }
      >
        <div>{`${formattedPrice} ${
          inventory.count ? `(x${inventory.count})` : ""
        }`}</div>
        {inventory.count > 1 && <div>{`Total : ${totalFormattedPrice}`}</div>}
      </div>
    );
  }, [formattedPrice, inventory.count, price, totalFormattedPrice]);

  const itemNameClass = [""];

  if (item.isStattrak) {
    itemNameClass.push("text-orange-400");
  } else if (item.isSouvenir) {
    itemNameClass.push("text-yellow-400");
  } else {
    itemNameClass.push("dark:text-white");
  }

  return (
    <div
      key={inventory.Item.id}
      className={"flex flex-col rounded-md border p-2 dark:bg-slate-900"}
    >
      <div className={"h-14 text-center " + itemNameClass.join(" ")}>
        {highLight(item.name, marketHashName)}
      </div>
      <div>
        <div className={"flex items-center justify-center"}>
          <img
            className={"w-52"}
            src={
              "https://community.cloudflare.steamstatic.com/economy/image/" +
              (item.iconUrlLarge || item.iconUrl)
            }
            alt=""
            loading={"lazy"}
          />
        </div>
      </div>
      {priceData}
      <div className={"flex h-5 gap-1.5 dark:text-white"}>
        <Tag style={"blue"} onClick={() => setSelectedType(item.type)}>
          {inventory.Item.type}
        </Tag>
        <Tag style={"green"} onClick={() => setSelectedWear(item.wear ?? "")}>
          {inventory.Item.wear}
        </Tag>
        {tags.map(({ key, tag }) => {
          return (
            <Tag key={key} {...tag} onClick={() => setSelectedTag(key)}>
              {item[key] ? tag.title : null}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

export default Item;
