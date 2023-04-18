import React, { useEffect, useState } from "react";
import { socket } from "../../App";
import { Item as ItemType, Price } from "../../types/api";
import Item from "../Item";
import { InventoryItemData } from "../Inventory";

type JobProps = {
  id: string;
};

type JobResponse = { price: Price; item: ItemType };

function Job({ id }: React.PropsWithoutRef<JobProps>) {
  const [prices, setPrices] = useState<JobResponse[]>([]);

  useEffect(() => {
    socket.on(`/job/${id}/prices`, (data: JobResponse) => {
      console.log("data", data);
      setPrices((prices) => [...prices, data]);
    });

    return () => {
      socket.off(`job/${id}/prices`);
    };
  }, [id]);

  return (
    <div>
      <h1 className={"dark:text-white"}>JOB</h1>
      <div className={"container grid grid-cols-5 gap-4"}>
        {prices.map((price) => {
          const inventory: InventoryItemData = {
            Item: price.item,
            count: 1,
            total: Number(price.price.medianPrice),
          };
          return (
            <Item
              key={price.item.id}
              inventory={inventory}
              marketHashName={null}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Job;
