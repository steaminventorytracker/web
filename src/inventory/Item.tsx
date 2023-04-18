import React from "react";
import { InventoryItemData } from "./Inventory";
import { Item as ItemType } from "../types/api";

type ItemProps = {
  inventory: InventoryItemData;
  marketHashName: string | null;
};

const getExterior = (item: ItemType) => {
  const tag = item.tags.find((tag) => tag.category === "Exterior");

  return tag?.localized_tag_name ?? "";
};

const getStatTrak = (item: ItemType) => {
  const tag = item.tags.find((tag) => tag.category === "Quality");

  return tag?.internal_name === "strange" ? tag.localized_tag_name ?? "" : "";
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

function Item({ inventory, marketHashName }: React.PropsWithoutRef<ItemProps>) {
  const item = inventory.Item;
  const price = item.Price ? Number(item.Price.at(0)?.medianPrice) : null;

  return (
    <div
      key={inventory.Item.id}
      className={"m-2 flex flex-col rounded-md border p-2 dark:bg-slate-900"}
    >
      <div className={"h-14 dark:text-white"}>
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
        <div className={"flex h-20 flex-col justify-end dark:text-white"}>
          <div>{`${getStatTrak(item)} ${getExterior(item)}`}</div>
          {price && (
            <>
              <div>{`${currencyFormatter.format(price)} (${
                inventory.count
              })`}</div>
              <div>{currencyFormatter.format(inventory.count * price)}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Item;
